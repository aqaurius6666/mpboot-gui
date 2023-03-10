export type Context = unknown;
export interface Logger {
  log(message: string, context?: Context): void;
  error(message: string, err?: Error): void;
  warn(message: string, context?: Context): void;
  debug(message: string, context?: Context): void;
}
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LogLevelToString = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};
const LogLevelToColor = {
  [LogLevel.DEBUG]: '\x1b[36m',
  [LogLevel.INFO]: '\x1b[32m',
  [LogLevel.WARN]: '\x1b[33m',
  [LogLevel.ERROR]: '\x1b[31m',
};

export class ConsoleLogger implements Logger {
  private level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }
  private formatMessage(logLevel: LogLevel, message: string): string {
    return `${new Date().toISOString()} ${LogLevelToColor[logLevel]}[${
      LogLevelToString[logLevel]
    }]\x1b[0m: ${message}`;
  }
  debug(message: string, context?: Context): void {
    if (this.level > LogLevel.DEBUG) {
      return;
    }
    if (context) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message), { context });
    } else {
      console.debug(this.formatMessage(LogLevel.DEBUG, message));
    }
  }

  log(message: string, context?: Context): void {
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
  warn(message: string, context?: Context): void {
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
