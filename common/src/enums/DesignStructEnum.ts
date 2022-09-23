export enum ActivityCategoryEnum {
    EVM = 'EVM',
    HTTP = 'HTTP',
    GENERAL = 'General'
}

export enum ActivityEnum {
    LOG_ACTIVITY = 'LogActivity',
    INVOKE_EVM = 'InvokeEVMActivity',
    NO_OP = 'NoOpActivity',
    MAPPER = 'MapperActivity',
    HTTP_REQUEST_REPLY = 'HTTPRequestReplyActivity'
}

export enum AssetType {
    ACTIVITY,
    RESOURCE,
    TRANSITION
}


export enum InputFieldTypeEnum {
    FREE_INPUT,
    FREE_INPUT_LIST,
    ADDRESS,
    BOOLEAN,
    DROPDOWN,
    RESOURCE_REF,
    EVM_ABI_FUNCTION,
}

export enum ResourceEnum {
    EVM_CONNECTION = 'GenericEVMConnectionResource',
    EVM_ABI = 'EVMABIResource',
    HTTP_CONNECTION = 'HTTPConnectionResource',
    IPFS_CONNECTON = 'IPFSConnectionResource'
}

export enum ResourceCategoryEnum {
    EVM = 'EVM',
    HTTP = 'HTTP'
}

export enum TabEnum {
    GENERAL = 'General',
    INPUT = 'Input',
    OUTPUT = 'Output',
    ERROR = 'Error'
}

export enum TriggerActivityEnum {
    SCHEDULER = 'Scheduler',
    EVM_EVENT_SCHEDULER = 'EVMEventScheduler'
}