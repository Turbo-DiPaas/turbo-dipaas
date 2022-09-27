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
import {testSetup} from "../../../../testSetup";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity) // solidiity matchers, e.g. expect().to.be.revertedWith("message")

describe('InvokeEVMActivity', () => {
    testSetup()
    let invokeEVMActivity: InvokeEVMActivity
    let storageContract: Storage
    const context = new WorkflowContext()
    let signers: SignerWithAddress[]

    const abiResourceId = 'abires'
    const connResId = 'evmconnres'

    beforeEach(async () => {
        signers = await ethers.getSigners()
        const Storage = await ethers.getContractFactory("Storage")
        storageContract = await Storage.deploy() as Storage

        const abiResParams = new Map()
        abiResParams.set('abi', JSON.stringify(StorageArtifact.abi))

        const abiResource = new EVMABIResource(abiResourceId, 'test abi resource', ResourceTypeEnum.EVMABI, abiResParams)

        const connParams = new Map()
        // connParams.set('url', 'http://localhost:8545') -> this may not work on Linux ;/
        connParams.set('url', 'http://127.0.0.1:8545')
        connParams.set('privateKey', '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

        const connResource = new GenericEVMConnectionResource(connResId, 'test connection resource', ResourceTypeEnum.EVMConnection, connParams)

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

    it('allows to retrieve data from raw call', async () => {
        const receivingAddress = signers[1].address
        invokeEVMActivity.params.set('selectedFunction', '"store"')
        invokeEVMActivity.params.set('transactionParams', [39])
        const result = await invokeEVMActivity.invoke(context)

        invokeEVMActivity.params.set('transactionRecipient', storageContract.address)
        //Storage.retrieve()
        invokeEVMActivity.params.set('rawInput', '"0x2e64cec1"')
        invokeEVMActivity.params.set('transactionType', '"call"')
        invokeEVMActivity.params.set('isRawTransaction', true)

        const balanceBefore = await ethers.provider.getBalance(receivingAddress)
        const result2 = await invokeEVMActivity.invoke(context)
        const balanceAfter = await ethers.provider.getBalance(receivingAddress)

        expect(result.status).to.be.equal(200)
        expect(result2.status).to.be.equal(200)
        expect(result2.returnData.get('data')).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000027')
        expect(result2.returnData.size).to.be.equal(1)
        expect(balanceAfter.toString()).to.be.equal(balanceBefore.toString())
    })

    it('allows to send raw transaction', async () => {
        const receivingAddress = signers[1].address
        invokeEVMActivity.params.set('value', '2 * (10^18)')
        invokeEVMActivity.params.set('transactionRecipient', receivingAddress)
        invokeEVMActivity.params.set('transactionType', '"send"')
        invokeEVMActivity.params.set('isRawTransaction', true)

        const balanceBefore = await ethers.provider.getBalance(receivingAddress)
        const result = await invokeEVMActivity.invoke(context)
        const balanceAfter = await ethers.provider.getBalance(receivingAddress)

        expect(result.status).to.be.equal(200)
        expect(balanceAfter.toString()).to.be.equal(balanceBefore.add('2000000000000000000').toString())
    })

    it('retrieves smart contract state properly', async () => {
        invokeEVMActivity.params.set('selectedFunction', '"store"')
        invokeEVMActivity.params.set('transactionParams', [39])
        const result = await invokeEVMActivity.invoke(context)

        expect(await storageContract.retrieve()).to.be.equal(39)
        expect(result.status).to.be.equal(200)

        invokeEVMActivity.params.set('selectedFunction', '"retrieve"')
        invokeEVMActivity.params.set('transactionParams', [])
        const retrieveResult = await invokeEVMActivity.invoke(context)

        expect(retrieveResult.status).to.be.equal(200)
        expect(retrieveResult.returnData.get('callResult')).to.be.eql(['39'])
    })

    it('can change smart contract state', async () => {
        invokeEVMActivity.params.set('selectedFunction', '"store"')
        invokeEVMActivity.params.set('transactionParams', [5])
        const result = await invokeEVMActivity.invoke(context)

        expect(await storageContract.retrieve()).to.be.equal(5)
        expect(result.status).to.be.equal(200)
    })
})
