import TransitionBase from "../../transition/TransitionBase";
import ActivityBase from "../ActivityBase";
import ActivityNode from "./ActivityNode";

//TODO: implement parents mapping properly
export default class ActivityGraph {
   activityNodes: Map<string, ActivityNode[]> = new Map()
   activityIdMapping: Map<string, ActivityBase> = new Map()

   addActivity(activity: ActivityBase) {
      this.activityIdMapping.set(activity.id, activity)
   }

   addTransition(transition: TransitionBase) {
      if (this.activityNodes.has(transition.from)) {
         const nodes = this.activityNodes.get(transition.from) ?? []
         const node = new ActivityNode(transition)
         node.addParent(transition.from)
         this.activityNodes.set(transition.from, [...nodes, node])
         // for (const node of nodes) {
         //    node.addParent(transition.from)
         // }
      } else {
         const node = new ActivityNode(transition)
         node.addParent(transition.from)
         this.activityNodes.set(transition.from, [node])
      }
   }

   getRootId(): string {
      return ""
   }

   getChildren(id: string): {activity: ActivityBase, transition: TransitionBase}[] {
      const returnData: any = []
      if (!this.activityNodes.has(id))
         return returnData

      const children = this.activityNodes.get(id)!
      for (const node of children) {
         const transition = node.transition
         if (this.activityIdMapping.has(transition.to)) {
            returnData.push({
               activity: this.activityIdMapping.get(transition.to),
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
