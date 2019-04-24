const log = require("metalogger")();

exports.setupErrorHandling = (app) => {
  // Custom formatting for error responses.
  app.use((err, req, res, next) => {
    if (err) {
      const out = {};
      if (err.isJoi || err.type === "validation") {
        // validation error. No need to log these
        out.errors = err.details;
        res.status(400).json(out);
        return;
      }
      log.error(err);
      if (process.env.NODE_ENV === "production") {
        out.errors = ["Internal server error"];
      } else {
        out.errors = [err.toString()];
      }
      res.status(500).json(out);
      return;
    }
    next();
  });
};

/**
 *
 *
 * @param {Function} func
 * @returns a function
 */
exports.catchError = func => (req, res, next) => func(req, res, next).catch(next);

/**
 *
 *
 * @param {object} err - Error Object
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 */
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>",
    ),
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    "text/json": () => {
      res.json({
        message: err.message,
        error: {},
      });
    }, // Form Submit, Reload the page
    "application/json": () => res.json(errorDetails), // Ajax call, send JSON back
  });
};

/**
 *
 *
 * @param {object} err - Error Object
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 */
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
};

// module.exports = setupErrorHandling;
