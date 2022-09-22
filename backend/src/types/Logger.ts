export enum LogLevel {
    TRACE,
    DEBUG,
    INFO ,
    WARN ,
    ERROR,
}

export interface Logger {
    trace(message: string): void
    debug(message: string): void
    info(message: string): void
    warning(message: string): void
    error(message: string): void
    log(message: string, logLevel: LogLevel): void
}