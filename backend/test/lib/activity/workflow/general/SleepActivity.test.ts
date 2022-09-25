import chai, { expect } from 'chai'
import SleepActivity from "../../../../../src/lib/activity/workflow/impl/general/SleepActivity";
import WorkflowContext from "../../../../../src/app/WorkflowContext";
import ActivityResultPropsMock from "../../mock/ActivityResultPropsMock";
import {testSetup} from "../../../../testSetup";

describe('SleepActivity', () => {
    testSetup()
    let sleepActivity: SleepActivity
    const params = new Map()
    params.set('duration', 2000)
    const context = new WorkflowContext()
    new ActivityResultPropsMock('b', 'mock').invoke(context).then(res => {
        context.addActivityResult('b', res)
    })

    it('sleeps for specificed amount of time', async () => {
        sleepActivity = new SleepActivity('duration', 'Sleep activity', params)
        const timeBefore = Date.now()
        const result = await sleepActivity.invoke(context)
        const timeAfter = Date.now()
        const timeDifference = timeAfter - timeBefore

        expect(result.status).to.be.equal(200)
        expect(result.returnData.size).to.be.equal(0)
        expect(result.error).to.be.undefined


        expect(timeDifference < 2300).to.be.true
        expect(timeDifference >= 2000).to.be.true
    })

    it('skips when setting zero as duration', async () => {
        params.delete('duration')
        sleepActivity = new SleepActivity('duration', 'Sleep activity', params)
        const timeBefore = Date.now()
        const result = await sleepActivity.invoke(context)
        const timeAfter = Date.now()
        const timeDifference = timeAfter - timeBefore

        expect(result.status).to.be.equal(200)
        expect(result.returnData.size).to.be.equal(0)
        expect(result.error).to.be.undefined


        expect(timeDifference < 100).to.be.true
    })

    it('skips when setting no duration', async () => {
        params.set('duration', 0)
        sleepActivity = new SleepActivity('duration', 'Sleep activity', params)
        const timeBefore = Date.now()
        const result = await sleepActivity.invoke(context)
        const timeAfter = Date.now()
        const timeDifference = timeAfter - timeBefore

        expect(result.status).to.be.equal(200)
        expect(result.returnData.size).to.be.equal(0)
        expect(result.error).to.be.undefined


        expect(timeDifference < 100).to.be.true
    })
})
