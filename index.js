

require("dotenv").config();
/**
 * This simple module enables you to add additional directories to the Node.js module search path (for top-level app modules only).
 *  This allows application-level modules to be required as if they were installed into the node_modules directory.
 */
require("app-module-path/register");

// Define all dependencies needed
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const morgan = require("morgan");
const expressValidator = require("express-validator");
const cors = require("cors");
const methodOverride = require("method-override");
const responseTime = require("response-time");
const compression = require("compression");
const latencyHeaders = require("express-latency-headers");
const rateLimit = require("express-rate-limit"); // Package to limit repeated requests to public APIs and/or endpoints.
const hpkp = require("hpkp");
const mailer = require("config/mailer");

const ninetyDaysInSeconds = 7776000;

const customerService = require("Services/CustomerService");
const orderService = require("Services/OrderService");
const productService = require("Services/ProductService");
const shoppingCartService = require("Services/ShoppingCartService");
const paymentService = require("Services/PaymentService");
const logger = require("./config/winston");
const config = require("./config");
const { productionErrors, developmentErrors } = require("./utils/handlers");

const app = express();

app.use(latencyHeaders());

/**
 * This is a function that helps secure the app using the Helmet Package
 * Helmet helps you secure your Express apps by setting various HTTP headers.
 * @param {*} app
 *
 */
function applyAppSecurity(app) {
  app.use(helmet());
  app.use(
    hpkp({
      maxAge: ninetyDaysInSeconds,
      sha256s: ["AbCdEf123=", "ZyXwVu456="],
      // Set the header based on a condition.
      setIf(req, res) {
        return req.secure;
      },
    }),
  );
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
      },
    }),
  );
  app.use(helmet.xssFilter());
  app.use(
    helmet.expectCt({
      enforce: true,
      maxAge: 123,
    }),
  );
  app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
  const limiter = new rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0, // disable delaying - full speed until the max limit is reached
  });
  app.use(limiter);
}

function appServices(app) {
  // Apply security to application
  applyAppSecurity(app);

  // Set response Content-Type
  app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  });

  app.use(compression()); // Compress all responses
  app.use(responseTime()); // Create a middleware that adds a X-Response-Time header to responses.
  app.use(cors());
  app.use(express.json({}));
  app.use(express.urlencoded({ extended: true }));
  app.use(expressValidator()); // Expose a bunch of validation methods
  app.use(methodOverride());
  app.use(morgan("combined", { stream: logger.stream }));

  app.use(developmentErrors);
  if (process.env.NODE_ENV === "production") {
    app.use(productionErrors);
  }

  // Load up the app routes
  serviceRoutes(app);
}

// Function to handle the app routes
function serviceRoutes(app) {
  app.use("/api/v1/customers", customerService);
  app.use("/api/v1/orders", orderService);
  app.use("/api/v1/products", productService);
  app.use("/api/v1/shoppingcarts", shoppingCartService);
  app.use("/api/v1/payments", paymentService);
}


// Start application
function invokeAppService(app) {
  appServices(app);
}

invokeAppService(app);

// Get notified of anything that is taking down your Node process while in production
if (process.env.NODE_ENV === "production") {
  process.on("uncaughtException", (err) => {
    logger.error(err.stack);
    mailer.sendMail(
      {
        from: "alerts@mycompany.com",
        to: "bamgbosemorayo@gmail.com",
        subject: "Server Down Alert",
        text: "Server Down",
      },
      (err) => {
        if (err) logger.error(err);
        process.exit(1);
      },
    );
  });
}

module.exports = app;
