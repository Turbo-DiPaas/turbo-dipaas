import {waffle} from 'hardhat'
import {ethers} from "hardhat";
import StorageArtifact from '../../../../../mock/artifacts/test/mock/evm/Storage.sol/Storage.json'
import {Storage} from '../../../../../mock/types'
import chai, {expect} from 'chai'
import WorkflowContext from "../../../../../src/app/WorkflowContext";
import InvokeEVMActivity from "../../../../../src/lib/activity/workflow/impl/evm/InvokeEVMActivity";
import {MockProvider, solidity} from 'ethereum-waffle'
import Container from "typedi";
import EVMABIResource from "../../../../../src/lib/resource/evm/EVMABIResource";
import {ResourceTypeEnum} from "../../../../../../common/src/enums/ResourceTypeEnum";
import GenericEVMConnectionResource from "../../../../../src/lib/resource/evm/GenericEVMConnectionResource";
import GenericEVMConnectionResourceMock from "../../../../mock/evm/GenericEVMConnectionResourceMock";

chai.use(solidity) // solidiity matchers, e.g. expect().to.be.revertedWith("message")

describe('InvokeEVMActivity', () => {
    let invokeEVMActivity: InvokeEVMActivity
    let provider: MockProvider
    let storageContract: Storage
    const context = new WorkflowContext()

    const abiResourceId = 'abires'
    const connResId = 'evmconnres'

    beforeEach(async () => {
        // provider = new MockProvider({ ganacheOptions: { gasLimit: 100000000 } })
        // storageContract = (await waffle.deployContract(provider.getSigner(0), StorageArtifact, [])) as Storage

        const Storage = await ethers.getContractFactory("Storage")
        storageContract = await Storage.deploy() as Storage

        // storageContract = (await waffle.deployContract(provider.getSigner(0), StorageArtifact, [])) as Storage

        const abiResParams = new Map()
        abiResParams.set('abi', StorageArtifact.abi)

        const abiResource = new EVMABIResource(abiResourceId, 'test abi resource', ResourceTypeEnum.EVMABI, abiResParams)
        const connResource = new GenericEVMConnectionResourceMock(connResId, 'test connection resource', ResourceTypeEnum.EVMConnection, new Map())

        Container.set([
           {id: abiResourceId, value: abiResource},
           {id: connResId, value: connResource},
        ])

        invokeEVMActivity = new InvokeEVMActivity('a', 'invoke evm activity', new Map(), [abiResourceId, connResId])
        invokeEVMActivity.params.set('transactionRecipient', '"' + storageContract.address + '"')
    })

    it('retrieves resource with proper type', async () => {
        const res = invokeEVMActivity.getResource(GenericEVMConnectionResource)

        expect(res instanceof GenericEVMConnectionResource).to.be.true
    })

    it('allows to change smart contract state', async () => {
        invokeEVMActivity.params.set('selectedFunction', '"store"')
        invokeEVMActivity.params.set('transactionParams', [5])
        const result = await invokeEVMActivity.invoke(context)

        expect(await storageContract.retrieve()).to.be.equal(5)
        expect(result.status).to.be.equal(200)
    })

})
