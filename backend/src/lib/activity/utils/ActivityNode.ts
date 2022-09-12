import TransitionBase from "../../transition/TransitionBase"

export default class ActivityNode {
   id: string
   transition: TransitionBase
   parents: string[] = []

   constructor(transition: TransitionBase) {
      this.id = transition.from
      this.transition = transition
   }

   addParent(id: string) {
      this.parents.push(id)
   }
}
