import Workflow from "../../Workflow";
import {Workflow as WorkflowStruct} from 'turbo-dipaas-common/src/types/api/workflow/Workflow';
import ActivityGroup from "../../../lib/group/ActivityGroup";
import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {ActivityList} from "../../../lib/activity/ActivityList";
import {Transition} from "turbo-dipaas-common/src/types/api/workflow/Transition";
import SuccessTransition from "../../../lib/transition/SuccessTransition";
import ActivityBase from "../../../lib/activity/ActivityBase";
import TransitionBase from "../../../lib/transition/TransitionBase";

const workflowFromJson = (workflow: WorkflowStruct): Workflow => {
    const activities: ActivityBase[] = []
    const transitions: TransitionBase[] = []
    const groups: ActivityGroup[] = []

    workflow.structure.activities.forEach((activity: Activity) => {
        const props: Map<string, any> = new Map()
        activity.params?.forEach(param => {
            props.set(param.name, param.value)
        })
        let activityObject = new ActivityList[activity.type](activity.id, activity.name, props, activity.resources);
        activities.push(activityObject)
    });

    workflow.structure.transitions?.forEach((transition: Transition) => {
        let transitionObject = new SuccessTransition(transition.from, transition.to)
        transitions.push(transitionObject)
    })
    const rootGroup = new ActivityGroup(activities, transitions, groups)
    return new Workflow(workflow.id, rootGroup)
}

export { workflowFromJson }
