/**
 * winston.js
 * This file will contain winston configuration
 */

("use strict");

const appRoot = require("app-root-path");
var winston = require("winston");

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

/** I'm defining a stream function that will be able to get morgan-generated output into the winston log files.
 * I decided to use the info level so the output will be picked up by both transports (file and console)
 */

 // create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;
