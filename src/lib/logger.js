export const DEBUG = 0
export const INFO = 1
export const WARNING = 2
export const ERROR = 3

export class Logger {

  constructor(debug, level) {
    // Enable?
    this.enabled = debug;
    // Log level
    const levels = ['debug', 'info', 'warning', 'error']
    let index = levels.indexOf(level);
    if (index >= 0) {
      // Custom level
      this.level = index
    } else {
      // Default level
      this.level = ERROR
    }
  }

  debug(msg) {
    if (this.enabled && this.level <= DEBUG) {
      console.debug(msg)
    }
  }

  info(msg) {
    if (this.enabled && this.level <= INFO) {
      console.info(msg)
    }
  }

  warn(msg) {
    if (this.enabled && this.level <= WARNING) {
      console.warn(msg)
    }
  }
  
  error(msg) {
    if (this.enabled && this.level <= ERROR) {
      console.error(msg)
    }
  }
}

const logger = new Logger(process.env.APP_DEBUG, process.env.LOG_LEVEL)
logger.debug("Logger enabled")

export default logger