// __tests__/logger.test.js
// Place next to logger.js (adjust the require path if needed)

const ORIGINAL_ENV = { ...process.env };

const spyAll = () => {
  const e = jest.spyOn(console, "error").mockImplementation(() => {});
  const w = jest.spyOn(console, "warn").mockImplementation(() => {});
  const i = jest.spyOn(console, "info").mockImplementation(() => {});
  const l = jest.spyOn(console, "log").mockImplementation(() => {});
  return { e, w, i, l };
};

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe("logger environment levels", () => {
  test("local -> DEBUG: error, warning, info, debug are active", () => {
    process.env.REACT_APP_ENVIRONMENT = "local";
    const spies = spyAll();

    jest.isolateModules(() => {
      const logger = require("..//logger").default; // adjust if needed
      logger.error("E");
      logger.warning("W");
      logger.info("I");
      logger.debug("D");
    });

    expect(spies.e).toHaveBeenCalledWith("E");
    expect(spies.w).toHaveBeenCalledWith("W");
    expect(spies.i).toHaveBeenCalledWith("I");
    expect(spies.l).toHaveBeenCalledWith("D");
  });

  test("development -> INFO: error, warning, info active; debug NO-OP", () => {
    process.env.REACT_APP_ENVIRONMENT = "development";
    const spies = spyAll();

    jest.isolateModules(() => {
      const logger = require("..//logger").default;
      logger.error("E");
      logger.warning("W");
      logger.info("I");
      logger.debug("D"); // should NOT call console.log
    });

    expect(spies.e).toHaveBeenCalledWith("E");
    expect(spies.w).toHaveBeenCalledWith("W");
    expect(spies.i).toHaveBeenCalledWith("I");
    expect(spies.l).not.toHaveBeenCalled();
  });

  test("production/other -> WARNING: error, warning active; info/debug NO-OP", () => {
    process.env.REACT_APP_ENVIRONMENT = "production";
    const spies = spyAll();

    jest.isolateModules(() => {
      const logger = require("..//logger").default;
      logger.error("E");
      logger.warning("W");
      logger.info("I"); // NO-OP
      logger.debug("D"); // NO-OP
    });

    expect(spies.e).toHaveBeenCalledWith("E");
    expect(spies.w).toHaveBeenCalledWith("W");
    expect(spies.i).not.toHaveBeenCalled();
    expect(spies.l).not.toHaveBeenCalled();
  });
});
