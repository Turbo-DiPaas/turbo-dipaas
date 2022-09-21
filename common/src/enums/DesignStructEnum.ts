export enum ActivityCategoryEnum {
    SMART_CONTRACT = 'Smart Contract',
    GENERAL = 'General'
}

export enum ActivityEnum {
    LOG_ACTIVITY = 'LogActivity',
    SEND_TRANSACTION = 'SendTransaction'
}

export enum AssetType {
    ACTIVITY,
    RESOURCE,
    TRANSITION
}

export enum InputFieldTypeEnum {
    FREE_INPUT,
    BOOLEAN,
    DROPDOWN,
    RESOURCE_REF
}

export enum ResourceEnum {
    EVM_CONNECTION = 'EVM connection',
    IPFS_CONNECTON = 'IPFS(File) connection'
}

export enum TabEnum {
    GENERAL = 'General',
    INPUT = 'Input',
    OUTPUT = 'Output',
    ERROR = 'Error'
}

export enum TriggerActivityEnum {
    SCHEDULER = 'Scheduler'
}