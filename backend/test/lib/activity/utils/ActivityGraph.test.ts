import chai, { expect } from 'chai'
import ActivityGraph from '../../../../src/lib/activity/utils/ActivityGraph'
import NoOpActivity from '../../../../src/lib/activity/workflow/impl/general/NoOpActivity'
import SuccessTransition from '../../../../src/lib/transition/SuccessTransition'
import Scheduler from "../../../../src/lib/activity/trigger/impl/general/Scheduler";

describe('ActivityGraph', () => {
    describe('basic structure', () => {
        let activityGraph: ActivityGraph
        beforeEach(() => {
            //            a
            //           / \
            //          b   d __
            //         / \ / \  \
            //        c   e   f  g
            //            |
            //            h
            activityGraph = new ActivityGraph()
            activityGraph.addActivity(new Scheduler('a', 'act-a'))
            activityGraph.addActivity(new NoOpActivity('b', 'act-b'))
            activityGraph.addActivity(new NoOpActivity('c', 'act-c'))
            activityGraph.addActivity(new NoOpActivity('d', 'act-d'))
            activityGraph.addActivity(new NoOpActivity('e', 'act-e'))
            activityGraph.addActivity(new NoOpActivity('f', 'act-f'))
            activityGraph.addActivity(new NoOpActivity('g', 'act-g'))
            activityGraph.addActivity(new NoOpActivity('h', 'act-h'))

            activityGraph.addTransition(new SuccessTransition('a', 'b'))
            activityGraph.addTransition(new SuccessTransition('a', 'd'))
            activityGraph.addTransition(new SuccessTransition('b', 'c'))
            activityGraph.addTransition(new SuccessTransition('b', 'e'))
            activityGraph.addTransition(new SuccessTransition('d', 'e'))
            activityGraph.addTransition(new SuccessTransition('d', 'f'))
            activityGraph.addTransition(new SuccessTransition('d', 'g'))
            activityGraph.addTransition(new SuccessTransition('e', 'h'))
        })

        it('properly gets all the children from the top element', async () => {
            const ch1 = activityGraph.getChildren('a')
            expect(ch1[0]?.activity.id).to.be.equal('b')
            expect(ch1[0]?.activity.name).to.be.equal('act-b')
            expect(ch1[0]?.transition.from).to.be.equal('a')
            expect(ch1[0]?.transition.to).to.be.equal('b')
            expect(ch1[1]?.activity.id).to.be.equal('d')
            expect(ch1[1]?.activity.name).to.be.equal('act-d')
            expect(ch1[1]?.transition.from).to.be.equal('a')
            expect(ch1[1]?.transition.to).to.be.equal('d')

            const ch2 = activityGraph.getChildren('d')
            expect(ch2[0]?.activity.id).to.be.equal('e')
            expect(ch2[0]?.activity.name).to.be.equal('act-e')
            expect(ch2[0]?.transition.from).to.be.equal('d')
            expect(ch2[0]?.transition.to).to.be.equal('e')
            expect(ch2[1]?.activity.id).to.be.equal('f')
            expect(ch2[1]?.activity.name).to.be.equal('act-f')
            expect(ch2[1]?.transition.from).to.be.equal('d')
            expect(ch2[1]?.transition.to).to.be.equal('f')
            expect(ch2[2]?.activity.id).to.be.equal('g')
            expect(ch2[2]?.activity.name).to.be.equal('act-g')
            expect(ch2[2]?.transition.from).to.be.equal('d')
            expect(ch2[2]?.transition.to).to.be.equal('g')
        })

        it('properly gets all the parents from the bottom element', async () => {
           const par1 = activityGraph.getParentIds('e')
           expect(par1[0]).to.be.equal('b')
           expect(par1[1]).to.be.equal('d')
           expect(par1.length).to.be.equal(2)

           const par2 = activityGraph.getParentIds('b')
           expect(par2[0]).to.be.equal('a')
           expect(par2.length).to.be.equal(1)

           const par3 = activityGraph.getParentIds('d')
           expect(par3[0]).to.be.equal('a')
           expect(par3.length).to.be.equal(1)
        })

        it('properly gets root element', async () => {
            const rootElement = activityGraph.getRootId()
            expect(rootElement).to.be.equal('a')
        })
    })
})
