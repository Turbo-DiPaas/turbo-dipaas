import chai, { expect } from 'chai'
import ActivityGraph from '../../src/lib/activity/utils/ActivityGraph'
import SuccessTransition from '../../src/lib/transition/SuccessTransition'
import Scheduler from "../../src/lib/activity/trigger/impl/Scheduler";
import WorkflowProcess from "../../src/app/WorkflowProcess";
import WorkflowTriggerBase from "../../src/lib/activity/trigger/WorkflowTriggerBase";
import LogActivity from "../../src/lib/activity/workflow/impl/general/LogActivity";

describe('WorkflowProcess', () => {
    describe('multiple paths run', () => {
        let activityGraph: ActivityGraph
        let workflowProcess: WorkflowProcess
        beforeEach(() => {
            //            a
            //           / \
            //          b   d __
            //         / \ / \  \
            //        c   e   f  g
            //            |
            //            h

            let i = 0
            const increment = () => {
                i += 1
                const logProps: Map<string, any> = new Map()
                logProps.set('message', `logging number ${i}`)
                return logProps
            }

            const schedulerOpts = new Map()
            schedulerOpts.set('runOnce', true)

            activityGraph = new ActivityGraph()
            activityGraph.addActivity(new Scheduler('a', 'act-a', schedulerOpts))
            activityGraph.addActivity(new LogActivity('b', 'act-b', increment()))
            activityGraph.addActivity(new LogActivity('c', 'act-c', increment()))
            activityGraph.addActivity(new LogActivity('d', 'act-d', increment()))
            activityGraph.addActivity(new LogActivity('e', 'act-e', increment()))
            activityGraph.addActivity(new LogActivity('f', 'act-f', increment()))
            activityGraph.addActivity(new LogActivity('g', 'act-g', increment()))
            activityGraph.addActivity(new LogActivity('h', 'act-h', increment()))

            activityGraph.addTransition(new SuccessTransition('a', 'b'))
            activityGraph.addTransition(new SuccessTransition('a', 'd'))
            activityGraph.addTransition(new SuccessTransition('b', 'c'))
            activityGraph.addTransition(new SuccessTransition('b', 'e'))
            activityGraph.addTransition(new SuccessTransition('d', 'e'))
            activityGraph.addTransition(new SuccessTransition('d', 'f'))
            activityGraph.addTransition(new SuccessTransition('d', 'g'))
            activityGraph.addTransition(new SuccessTransition('e', 'h'))

            workflowProcess = new WorkflowProcess(activityGraph)
        })

        it('should run basic workflow without issues', async () => {
            const startActivity = activityGraph.activityIdMapping.get(activityGraph.getRootId()) as WorkflowTriggerBase
            startActivity.start(res => {
                workflowProcess.start(res)
            })

            const processContext = workflowProcess.context

            await new Promise(r => setTimeout(r, 1500));

            expect(processContext.getActivityResult('a')).is.not.undefined
            expect(processContext.getActivityResult('b')).is.not.undefined
            expect(processContext.getActivityResult('c')).is.not.undefined
            expect(processContext.getActivityResult('d')).is.not.undefined
            expect(processContext.getActivityResult('e')).is.not.undefined
            expect(processContext.getActivityResult('f')).is.not.undefined
            expect(processContext.getActivityResult('g')).is.not.undefined
            expect(processContext.getActivityResult('h')).is.not.undefined
        });
    })

    describe('simple path run', () => {
        let activityGraph: ActivityGraph
        let workflowProcess: WorkflowProcess
        beforeEach(() => {
            //            a
            //            |
            //            b
            //            |
            //            c
            //            |
            //            d
            //            |
            //            e

            let i = 0
            const increment = () => {
                i += 1
                const logProps: Map<string, any> = new Map()
                logProps.set('message', `logging number ${i}`)
                return logProps
            }

            activityGraph = new ActivityGraph()
            activityGraph.addActivity(new Scheduler('a', 'act-a'))
            activityGraph.addActivity(new LogActivity('b', 'act-b', increment()))
            activityGraph.addActivity(new LogActivity('c', 'act-c', increment()))
            activityGraph.addActivity(new LogActivity('d', 'act-d', increment()))
            activityGraph.addActivity(new LogActivity('e', 'act-e', increment()))

            activityGraph.addTransition(new SuccessTransition('a', 'b'))
            activityGraph.addTransition(new SuccessTransition('b', 'c'))
            activityGraph.addTransition(new SuccessTransition('c', 'd'))
            activityGraph.addTransition(new SuccessTransition('d', 'e'))

            workflowProcess = new WorkflowProcess(activityGraph)
        })

        it('should run basic workflow without issues', async () => {
            const startActivity = activityGraph.activityIdMapping.get(activityGraph.getRootId()) as WorkflowTriggerBase
            startActivity.start(res => {
                workflowProcess.start(res)
            })
        });
    })
})
