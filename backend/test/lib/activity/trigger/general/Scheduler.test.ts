import chai, { expect } from 'chai'
import sinon, {SinonSpy} from 'sinon';
import ActivityGraph from '../../../../src/lib/activity/utils/ActivityGraph'
import SuccessTransition from '../../../../src/lib/transition/SuccessTransition'
import Scheduler from "../../../../src/lib/activity/trigger/impl/general/Scheduler";
import LogActivity from "../../../../src/lib/activity/workflow/impl/general/LogActivity";
import WorkflowProcess from "../../../../src/app/WorkflowProcess";
import WorkflowTriggerBase from "../../../../src/lib/activity/trigger/WorkflowTriggerBase";
import {testSetup} from "../../../../testSetup";

describe('Scheduler trigger', () => {
   let activityGraph: ActivityGraph
   let workflowProcess: WorkflowProcess
   let schedulerProps: Map<string, any>
   let spy: SinonSpy
   const message = 'test message'

   beforeEach(() => {
      testSetup()
      //            a
      //            |
      //            b

      spy = sinon.spy(console, 'log');
      const logProps: Map<string, any> = new Map()
      logProps.set('message', '"' + message + '"')
      schedulerProps = new Map()

      activityGraph = new ActivityGraph()
      activityGraph.addActivity(new LogActivity('b', 'act-b', logProps))

      activityGraph.addTransition(new SuccessTransition('a', 'b'))
   })

   afterEach(() => {
      spy.restore()
   })

   it('should run scheduler immediately when runOnce flag is passed', async () => {
      schedulerProps.set('runOnce', true)
      activityGraph.addActivity(new Scheduler('a', 'act-a', schedulerProps))
      workflowProcess = new WorkflowProcess(activityGraph)

      const dateBefore = new Date()
      const startActivity = activityGraph.activityIdMapping.get('a') as WorkflowTriggerBase
      await startActivity.start(res => {
         workflowProcess.start(res)
      })
      const dateAfter = new Date()
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(dateAfter.getTime() - dateBefore.getTime()).to.be.lt(200)
      expect(spy.calledWith(message)).to.be.true
      expect(spy.calledOnce).to.be.true
   });

   it('should run scheduler according to cron expression when one is passed', async () => {
      schedulerProps.set('cronExpression', '"* * * * * *"') // run every second
      activityGraph.addActivity(new Scheduler('a', 'act-a', schedulerProps))

      const startActivity = activityGraph.activityIdMapping.get('a') as WorkflowTriggerBase
      await startActivity.start(res => {
         workflowProcess = new WorkflowProcess(activityGraph)
         workflowProcess.start(res)
      })

      // wait 5,5 secs to allow scheduler to run for some time
      await new Promise((resolve) => setTimeout(resolve, 5500))

      expect(spy.calledWith(message)).to.be.true
      expect(spy.callCount).to.be.gte(4)
      expect(spy.callCount).to.be.lte(6)
   });

   it('should fail when wrong cron expression is passed', async () => {
      let executionCount = 0
      schedulerProps.set('cronExpression', '"70 * -1 * *"')
      activityGraph.addActivity(new Scheduler('a', 'act-a', schedulerProps))

      const startActivity = activityGraph.activityIdMapping.get('a') as WorkflowTriggerBase

      await startActivity.start(res => {
         executionCount += 1

         expect(res.error).to.not.be.undefined
         expect(res.status).to.not.be.equal(200)
      })

      expect(spy.calledWith(message)).to.be.false
      expect(spy.callCount).to.be.equal(0)
      expect(executionCount).to.be.equal(1)
   });
})
