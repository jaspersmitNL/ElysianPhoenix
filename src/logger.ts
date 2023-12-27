export class Logger {
  constructor(private prefix: string) {}

  private getTimestamp() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  info(...args: any[]) {
    console.log(`[${this.getTimestamp()}] [${this.prefix}] [INFO]`, ...args);
  }

  warn(...args: any[]) {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.warn(`[${this.getTimestamp()}] [${this.prefix}] [WARN]`, ...args);
  }

  error(...args: any[]) {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.error(`[${this.getTimestamp()}] [${this.prefix}] [ERROR]`, ...args);
  }
}
