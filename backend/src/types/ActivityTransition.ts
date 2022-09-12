import ActivityBase from "../lib/activity/ActivityBase";
import TransitionBase from "../lib/transition/TransitionBase";

export type ActivityTransition = {
    activity: ActivityBase,
    transition: TransitionBase
}