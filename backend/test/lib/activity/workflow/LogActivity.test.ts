import chai, { expect } from 'chai'
import sinon, {SinonSpy} from 'sinon';
import LogActivity from "../../../../src/lib/activity/workflow/impl/general/LogActivity";
import WorkflowContext from "../../../../src/app/WorkflowContext";
import ActivityResultPropsMock from "../mock/ActivityResultPropsMock";

describe('LogActivity', () => {
    let logActivity: LogActivity
    let spy: SinonSpy
    const message = '1234dfgjh'
    const context = new WorkflowContext()
    new ActivityResultPropsMock('b', 'mock').invoke(context).then(res => {
        context.addActivityResult('b', res)
    })

    beforeEach(() => {
        spy = sinon.spy(console, 'log');
        logActivity = new LogActivity('a', 'log activity')
        logActivity.params.set('message', message)
    })

    afterEach(() => {
        spy.restore()
    })

    it('properly prints message to console log', async () => {
        await logActivity.invoke(context)
        expect(spy.calledWith(message)).to.be.true
        expect(spy.calledOnce).to.be.true
    })

    it('returns expected data after call', async () => {
        const result = await logActivity.invoke(context)
        expect(result.status).to.be.equal(200)
        expect(result.returnData.size).to.be.equal(0)
        expect(result.error).to.be.undefined
    })

    it('injects message data from context', async () => {
        logActivity.params.set('message', 'test ${b.name} ${b.value} ${b.check} working')
        await logActivity.invoke(context)

        expect(spy.calledWith('test props mock 250 true working')).to.be.true
        expect(spy.calledOnce).to.be.true
    })
})
