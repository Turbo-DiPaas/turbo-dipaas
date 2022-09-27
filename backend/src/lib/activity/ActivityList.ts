import LogActivity from "./workflow/impl/general/LogActivity"
import InvokeEVMActivity from "./workflow/impl/evm/InvokeEVMActivity";
import NoOpActivity from "./workflow/impl/general/NoOpActivity";
import HTTPRequestReplyActivity from "./workflow/impl/http/HTTPRequestReplyActivity";
import MapperActivity from "./workflow/impl/general/MapperActivity";

import Scheduler from "./trigger/impl/general/Scheduler"
import EVMEventTrigger from "./trigger/impl/evm/EVMEventTrigger";
import SleepActivity from "./workflow/impl/general/SleepActivity";

import IPFSAddFileActivity from "./workflow/impl/ipfs/IPFSAddFileActivity";
import IPFSListFilesActivity from "./workflow/impl/ipfs/IPFSListFilesActivity"

export const ActivityList: any = {
    LogActivity,
    InvokeEVMActivity,
    NoOpActivity,
    HTTPRequestReplyActivity,
    MapperActivity,
    Scheduler,
    SleepActivity,
    EVMEventTrigger,
    IPFSAddFileActivity,
    IPFSListFilesActivity
}