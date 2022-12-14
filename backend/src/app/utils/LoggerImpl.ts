import {Logger, LogLevel} from "../../types/Logger";
import {ZonedDateTime} from "@js-joda/core";
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
    debug(message: any): void {
        this.log(message, LogLevel.DEBUG)
    }

    error(message: any): void {
        this.log(message, LogLevel.ERROR)
    }

    info(message: any): void {
        this.log(message, LogLevel.INFO)
    }

    log(message: any, logLevel: LogLevel): void {
        const targetLogLevel = process.env.LOG_LEVEL ?? LogLevel.INFO

        if (targetLogLevel <= logLevel ?? LogLevel.INFO) {
            let dt = ZonedDateTime.now().withFixedOffsetZone()
            const logMessage = dt.toString() + ' [' + getLogLevelString(logLevel) + ']: ' + JSON.stringify(message)

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

            try {
                if (!fs.existsSync('log.txt')) {
                    fs.writeFile('log.txt', '', () => {})
                }
                fs.appendFile('log.txt', logMessage + '\n', () => {})
            } catch(err) {
                console.error(err)
            }

            console.log(logMessage)
        }
    }

    trace(message: any): void {
        this.log(message, LogLevel.TRACE)
    }

    warning(message: any): void {
        this.log(message, LogLevel.WARN)
    }
}