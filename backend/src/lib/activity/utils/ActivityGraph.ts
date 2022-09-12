import TransitionBase from "../../transition/TransitionBase";
import ActivityBase from "../ActivityBase";
import ActivityNode from "./ActivityNode";
import WorkflowTriggerBase from "../trigger/WorkflowTriggerBase";
import SuccessTransition from "../../transition/SuccessTransition";
import {ActivityTransition} from "../../../types/ActivityTransition";

//TODO: take groups into consideration
export default class ActivityGraph {
   activityNodes: Map<string, ActivityNode[]> = new Map()
   activityIdMapping: Map<string, ActivityBase> = new Map()
   protected rootElement!: string

   addActivity(activity: ActivityBase) {
      this.activityIdMapping.set(activity.id, activity)
      if (activity instanceof WorkflowTriggerBase) {
         this.rootElement = activity.id
      }
   }

   //TODO: check if different kind of transactions works here in cases that children has anything other than always transaction
   // hint - it probably doesn't
   addTransition(transition: TransitionBase) {
      const node = new ActivityNode(transition)
      this.activityNodes.set(transition.from, [...this.activityNodes.get(transition.from) ?? [], node])

      if (transition.to) {
         const nodes = this.activityNodes.get(transition.to!) ?? [new ActivityNode(new SuccessTransition(transition.to!))]
         nodes.map((node) => {
            node.addParent(transition.from)
         })
         this.activityNodes.set(transition.to!, nodes)
      }
   }

   getRootId(): string {
      return this.rootElement
   }

   getChildren(id: string): ActivityTransition[] {
      const returnData: any = []
      if (!this.activityNodes.has(id))
         return returnData

      const children = this.activityNodes.get(id)!
      for (const node of children) {
         const transition = node.transition
         if (this.activityIdMapping.has(transition.to!)) {
            returnData.push({
               activity: this.activityIdMapping.get(transition.to!),
               transition: transition
            })
         }
      }
      return returnData
   }

   getParentIds(activityId: string): string[] {
      if (!this.activityNodes.has(activityId))
          return []

      return this.activityNodes.get(activityId)!
          .map((v) => {return v.parents})
          .reduce((prev, curr) => {return [...prev, ...curr]})
   }
}
