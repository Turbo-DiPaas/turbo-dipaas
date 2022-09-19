import chai, { expect } from 'chai'
import sinon, {SinonSpy} from 'sinon';
import ActivityGraph from '../../../../../src/lib/activity/utils/ActivityGraph'
import SuccessTransition from '../../../../../src/lib/transition/SuccessTransition'
import LogActivity from "../../../../../src/lib/activity/workflow/impl/general/LogActivity";
import WorkflowTriggerBase from "../../../../../src/lib/activity/trigger/WorkflowTriggerBase";
import EVMEventTrigger from "../../../../../src/lib/activity/trigger/impl/evm/EVMEventTrigger";
import {ethers} from "hardhat";
import EVMABIResource from "../../../../../src/lib/resource/evm/EVMABIResource";
import {ResourceTypeEnum} from "../../../../../../common/src/enums/ResourceTypeEnum";
import GenericEVMConnectionResourceMock from "../../../../mock/evm/GenericEVMConnectionResourceMock";
import Container from "typedi";
import StorageArtifact from '../../../../../mock/artifacts/test/mock/evm/Storage.sol/Storage.json'
import {Storage} from '../../../../../mock/types'
import {Provider} from "@ethersproject/providers";

describe('EVM event trigger', () => {
   let activityGraph: ActivityGraph
   let schedulerProps: Map<string, any>
   let spy: SinonSpy
   const message = 'test message'
   let storageContract: Storage
   let provider: Provider

   const abiResourceId = 'abires'
   const connResId = 'evmconnres'

   beforeEach(async () => {
      //            a
      //            |
      //            b

      spy = sinon.spy(console, 'log');
      const logProps: Map<string, any> = new Map()
      logProps.set('message', '"' + message + '"')
      schedulerProps = new Map()

      const Storage = await ethers.getContractFactory("Storage")
      storageContract = await Storage.deploy() as Storage

      const abiResParams = new Map()
      abiResParams.set('abi', StorageArtifact.abi)

      const abiResource = new EVMABIResource(abiResourceId, 'test abi resource', ResourceTypeEnum.EVMABI, abiResParams)
      const connResource = new GenericEVMConnectionResourceMock(connResId, 'test connection resource', ResourceTypeEnum.EVMConnection, new Map())

      provider = connResource.getProvider()

      Container.set([
         {id: abiResourceId, value: abiResource},
         {id: connResId, value: connResource},
      ])

      activityGraph = new ActivityGraph()
      activityGraph.addActivity(new LogActivity('b', 'act-b', logProps))

      activityGraph.addTransition(new SuccessTransition('a', 'b'))
   })

   afterEach(() => {
      spy.restore()
   })

   it('should fail when wrong cron expression is passed', async () => {
      let executionCount = 0
      schedulerProps.set('eventName', '"ValueStored"')
      schedulerProps.set('eventAddress', '"' + storageContract.address + '"')
      activityGraph.addActivity(new EVMEventTrigger('a', 'act-a', schedulerProps, [abiResourceId, connResId]))
      const blockNumberBefore = await provider.getBlockNumber()

      const startActivity = activityGraph.activityIdMapping.get('a') as WorkflowTriggerBase

      await startActivity.start(res => {
         executionCount += 1

         expect(res.error).to.not.be.undefined
         expect(res.status).to.not.be.equal(200)
      })

      await storageContract.store(28)

      // it takes a while before the process will catch up with the new block
      await new Promise((resolve) => setTimeout(resolve, 4000))
      const blockNumberAfter = await provider.getBlockNumber()

      expect(blockNumberAfter).to.be.equal(blockNumberBefore + 1)
      expect(spy.calledWith(message)).to.be.false
      expect(spy.callCount).to.be.equal(0)
      expect(executionCount).to.be.equal(1)
   });
})
