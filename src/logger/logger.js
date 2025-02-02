export const LOG_LEVEL = {
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  DEBUG: 4,
};

class Logger {
  #logLevel;
  error;
  warning;
  info;
  debug;

  constructor(logLevel) {
    this.#logLevel = logLevel;
    this.error = console.error.bind(console);
    this.warning =
      this.#logLevel > 1 ? console.warn.bind(console) : (message) => {};
    this.info =
      this.#logLevel > 2 ? console.info.bind(console) : (message) => {};
    this.debug =
      this.#logLevel > 3 ? console.log.bind(console) : (message) => {};
  }
}

let logger;
if (process.env.REACT_APP_ENVIRONMENT === "local") {
  logger = new Logger(LOG_LEVEL.DEBUG);
} else if (process.env.REACT_APP_ENVIRONMENT === "development") {
  logger = new Logger(LOG_LEVEL.INFO);
} else {
  logger = new Logger(LOG_LEVEL.WARNING);
}

export default logger;
