import {Logger, LogLevel} from "../../types/Logger";
import {LocalDateTime} from "@js-joda/core";
import * as fs from "fs";

const getLogLevelString = (ll: LogLevel) => {
    switch (ll) {
        case LogLevel.DEBUG:
            return 'DEBUG'
        case LogLevel.INFO:
            return 'INFO'
        case LogLevel.WARN:
            return 'WARN'
        case LogLevel.ERROR:
            return 'ERROR'
        case LogLevel.TRACE:
            return 'TRACE'
    }
}

export default class LoggerImpl implements Logger {
    debug(message: string): void {
        this.log(message, LogLevel.DEBUG)
    }

    error(message: string): void {
        this.log(message, LogLevel.ERROR)
    }

    info(message: string): void {
        this.log(message, LogLevel.INFO)
    }

    log(message: string, logLevel: LogLevel): void {
        let dt = LocalDateTime.now()
        const logMessage = dt.toString() + ' [' + getLogLevelString(logLevel) + ']: ' + message

        let stats = fs.statSync("log.txt")
        let fileSizeInBytes = stats.size;
        // Convert the file size to megabytes (optional)
        let fileSizeInMegabytes = fileSizeInBytes / (1024*1024);

        if (fileSizeInMegabytes > 10) {
            try {
                fs.unlinkSync('log.txt')
            } catch (e) {
                console.error(e)
            }
        }
        fs.appendFile('log.txt', logMessage + '\n', () => {})

        console.log(logMessage)
    }

    trace(message: string): void {
        this.log(message, LogLevel.TRACE)
    }

    warning(message: string): void {
        this.log(message, LogLevel.WARN)
    }
}