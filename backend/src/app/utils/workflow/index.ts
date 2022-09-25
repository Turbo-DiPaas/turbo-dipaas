import Workflow from "../../Workflow";
import {Workflow as WorkflowStruct} from 'turbo-dipaas-common/src/types/api/workflow/Workflow';
import ActivityGroup from "../../../lib/group/ActivityGroup";
import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {ActivityList} from "../../../lib/activity/ActivityList";
import {Transition} from "turbo-dipaas-common/src/types/api/workflow/Transition";
import SuccessTransition from "../../../lib/transition/SuccessTransition";
import ActivityBase from "../../../lib/activity/ActivityBase";
import TransitionBase from "../../../lib/transition/TransitionBase";
import {Resource} from "../../../../../common/src/types/api/workflow/Resource";
import Container from "typedi";
import {ResourceList} from "../../../lib/resource/ResourceList";
import {TransitionList} from "../../../lib/transition/TransitionList";

const workflowFromJson = (workflow: WorkflowStruct): Workflow => {
    const activities: ActivityBase[] = []
    const transitions: TransitionBase[] = []
    const groups: ActivityGroup[] = []

    workflow.structure.resources?.forEach((resource: Resource) => {
        const props: Map<string, any> = new Map()
        resource.params?.forEach(param => {
            props.set(param.name, param.value)
        })
        let resourceObject = new ResourceList[resource.type](resource.id, resource.name, resource.type, props);
        Container.set(resource.id, resourceObject)
    })

    workflow.structure.activities.forEach((activity: Activity) => {
        const props: Map<string, any> = new Map()
        activity.params?.forEach(param => {
            props.set(param.name, param.value)
        })
        let activityObject = new ActivityList[activity.type](activity.id, activity.name, props, activity.resources);
        activities.push(activityObject)
    });

    workflow.structure.transitions?.forEach((transition: Transition) => {
        let transitionObject = new TransitionList[transition.type](transition.from, transition.to, transition.condition);
        transitions.push(transitionObject)
    })
    const rootGroup = new ActivityGroup(activities, transitions, groups)
    return new Workflow(workflow.id, rootGroup)
}

export { workflowFromJson }
