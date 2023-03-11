export interface Logger {
  log(message: string, context?: any): void;
  error(message: string, err?: Error): void;
  warn(message: string, context?: any): void;
  debug(message: string, context?: any): void;
}
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export const LogLevelToString = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

export class ConsoleLogger implements Logger {
  private level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }
  private formatMessage(logLevel: LogLevel, message: string): string {
    return `${new Date().toISOString()} [${LogLevelToString[logLevel]}]: ${message}`;
  }
  debug(message: string, context?: any): void {
    if (this.level > LogLevel.DEBUG) {
      return;
    }
    if (context) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message), { context });
    } else {
      console.debug(this.formatMessage(LogLevel.DEBUG, message));
    }
  }

  log(message: string, context?: any): void {
    if (this.level > LogLevel.INFO) {
      return;
    }
    if (context) {
      console.log(this.formatMessage(LogLevel.INFO, message), { context });
    } else {
      console.log(this.formatMessage(LogLevel.INFO, message));
    }
  }
  error(message: string, err?: Error): void {
    if (this.level > LogLevel.ERROR) {
      return;
    }
    if (err) {
      console.error(this.formatMessage(LogLevel.ERROR, message), { err });
    } else {
      console.error(this.formatMessage(LogLevel.ERROR, message));
    }
  }
  warn(message: string, context?: any): void {
    if (this.level > LogLevel.WARN) {
      return;
    }
    if (context) {
      console.warn(this.formatMessage(LogLevel.WARN, message), { context });
    } else {
      console.warn(this.formatMessage(LogLevel.WARN, message));
    }
  }
}

export const logger: Logger = new ConsoleLogger(LogLevel.DEBUG);
