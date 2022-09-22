export enum ActivityCategoryEnum {
    EVM = 'EVM',
    HTTP = 'HTTP',
    GENERAL = 'General'
}

export enum ActivityEnum {
    LOG_ACTIVITY = 'LogActivity',
    INVOKE_EVM = 'InvokeEVM',
    ON_OP = 'NoOp',
    MAPPER = 'Mapper',
    HTTP_REQUEST_REPLY = 'HTTPRequestReply'
}

export enum AssetType {
    ACTIVITY,
    RESOURCE,
    TRANSITION
}

export enum InputFieldTypeEnum {
    FREE_INPUT,
    FREE_INPUT_LIST, // type in which you define arbitrary input list
    BOOLEAN,
    DROPDOWN,
    RESOURCE_REF
}

export enum ResourceEnum {
    EVM_CONNECTION = 'EVM connection',
    EVM_ABI = 'EVM ABI',
    HTTP_CONNECTION = 'HTTP connection',
    IPFS_CONNECTON = 'IPFS(File) connection'
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