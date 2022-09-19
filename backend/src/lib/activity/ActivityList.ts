import LogActivity from "./workflow/impl/general/LogActivity"
import Scheduler from "./trigger/impl/general/Scheduler"
import EVMEventTrigger from "./trigger/impl/evm/EVMEventTrigger"
import NoOpActivity from "./workflow/impl/general/NoOpActivity"
import InvokeEVMActivity from "./workflow/impl/evm/InvokeEVMActivity"

export const ActivityList: any = {
    LogActivity,
    NoOpActivity,
    InvokeEVMActivity,
    Scheduler,
    EVMEventTrigger
}