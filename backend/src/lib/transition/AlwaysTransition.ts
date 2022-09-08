import TransitionBase from "./TransitionBase";

export default class AlwaysTransition extends TransitionBase {
    canTransact(condition: string = ''): boolean {
       return true
    }
}
