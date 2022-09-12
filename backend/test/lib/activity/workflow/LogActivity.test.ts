import chai, { expect } from 'chai'
import sinon from 'sinon';
import LogActivity from "../../../../src/lib/activity/workflow/LogActivity";

describe('LogActivity', () => {
    let logActivity: LogActivity
    let spy: any
    const message = '1234dfgjh'
    beforeEach(() => {
        spy = sinon.spy(console, 'log');
        logActivity = new LogActivity('a', 'log activity')
        logActivity.params = new Map<string, any>()
        logActivity.params.set('message', message)
    })

    afterEach(() => {
        spy.restore()
    })

    it('properly prints message to console log', async () => {
        await logActivity.invoke()
        expect(spy.calledWith(message)).to.be.true
        expect(spy.calledOnce).to.be.true
    })

    it('returns expected data after call', async () => {
        const result = await logActivity.invoke()
        expect(result.status).to.be.equal(200)
        expect(result.returnData.size).to.be.equal(0)
        expect(result.error).to.be.undefined
    })

    //TODO: implement
    it('injects message data fron context', async () => {

    })
})
