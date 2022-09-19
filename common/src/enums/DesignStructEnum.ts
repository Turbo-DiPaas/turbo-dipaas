export enum ActivityCategoryEnum {
    SMART_CONTRACT = 'Smart Contract',
    GENERAL = 'General',
    EVN = 'Evm',
    SCHEDULER = 'Scheduler'
}

export enum ActivityEnum {
    LOG_ACTIVITY = 'LogActivity',
    SEND_TRANSACTION = 'SendTransaction',
    NO_OP = 'NoOpActivity',
    MAPPER = 'MapperActivity'
}

export enum InputFieldTypeEnum {
    FREE_INPUT = 'FreeInput',
    BOOLEAN = 'Boolean'
}

export enum ResourceEnum {
    EVM_CONNECTION = 'EVM connection',
    IPFS_CONNECTON = 'IPFS(File) connection'
}

export enum SelectFieldTypeEnum {
    DROPDOWN = 'DropDown'
}

export enum TabEnum {
    GENERAL = 'General',
    INPUT = 'Input',
    OUTPUT = 'Output',
    ERROR = 'Error'
}

export enum TriggerActivityEnum {
    SCHEDULER = 'Scheduler',
    EVM_EVENT_TRIGGER = 'EVMEventTrigger'
}