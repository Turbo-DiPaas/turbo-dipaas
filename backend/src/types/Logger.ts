export enum LogLevel {
    TRACE,
    DEBUG,
    INFO ,
    WARN ,
    ERROR,
}

export interface Logger {
    trace(message: any): void
    debug(message: any): void
    info(message: any): void
    warning(message: any): void
    error(message: any): void
    log(message: any, logLevel: LogLevel): void
}