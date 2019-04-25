/**
 * actions.js
 * This is the file that will handle customer related
 * actions.
 */


const { validationResult } = require("express-validator/check");
const logger = require("config/winston");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config/index");
const Customer = require("../models/customer");

const actions = {};
const model = new Customer();


actions.registerCustomer = async (req, res) => {
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });

  if (errors.length < 1) {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    logger.debug(hashedPassword);
    req.body.password = hashedPassword;
    model.register(req.body, (err, customer, isFound) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          auth: false,
          message: err.sqlMessage,
        });
      } if (!isFound) {
        return res.status(409).json({
          success: false,
          message: "The email is already registered. Please choose another one.",
        });
      }

        model.getSingleCustomerByEmail(req.body.email,(err, customer) => {

            const token = jwt.sign(
                { id: customer.insertId, email: req.body.email },
                config.jwt.secret,
                {
                    expiresIn: 86400, // expires in 24 hours
                },
            );
            res.status(200).json({
                customer,
                token,

            });
        });
    });
  } else {
    res.status(400).json({
      success: false,
      auth: false,
      message: errorMessage,
    });
    logger.error(errorMessage);
  }
};

actions.login = (req, res) => {
  model.checkEmail(req.body.email, async (err, customer) => {
    let errorMessage;
    const errors = validationResult(req)
      .array()
      .map((error) => {
        errorMessage = error.msg;
      });
    if (errors.length < 1) {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          auth: false,
          message: err.sqlMessage,
        });
      } if (customer.length === 0 || customer.length < 1) {
        return res.status(500).json({
          success: false,
          auth: false,
          message: "Invalid Email or Password",
        });
      }
      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        customer[0].password,
      );
      logger.debug(passwordIsValid);
      if (!passwordIsValid) {
        return res.status(401).json({
          auth: false,
          success: false,
          token: null,
          message: "Invalid Email or Password",
        });
      }
      const token = jwt.sign(
        { id: customer[0].customer_id, email: customer[0].email },
        config.jwt.secret,
        {
          expiresIn: 86400, // expires in 24 hours
        },
      );
        model.getSingleCustomerByEmail(customer[0].email,(err, customer) => {
            res.status(200).json({
                customer: customer,
                token,
                expires_in: "24h",
            });
        });
    } else {
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      logger.error(errorMessage);
    }
  });
};

actions.updateProfile = (req, res) => {
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });

  if (errors.length < 1) {
    req.body.customer_id = req.decoded.id;
    model.updateProfile(req.body, (err, message) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          auth: false,
          message: err.sqlMessage,
        });
      }

      model.getSingleCustomerById(req.body.customer_id, (err, customer) => {
        console.log(err);
          res.status(200).json({
              customer,
          });
      });
    });
  } else {
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
    logger.error(errorMessage);
  }
};

actions.getToken = (req, res) => {
  model.checkEmail(req.body.email, async (err, customer) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json({
        success: false,
        auth: false,
        message: err.sqlMessage,
      });
    } if (customer.length === 0 || customer.length < 1) {
      return res.status(500).json({
        success: false,
        auth: false,
        message: "Invalid Email or Password",
      });
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      customer[0].password,
    );
    if (!passwordIsValid) {
      return res.status(401).json({
        auth: false,
        success: false,
        token: null,
        message: "Invalid Email or Password",
      });
    }
    const token = jwt.sign(
      { id: customer[0].customer_id, email: customer[0].email },
      config.jwt.secret,
      {
        expiresIn: 86400, // expires in 24 hours
      },
    );
    res.status(200).json({
      success: true,
      auth: true,
      token,
    });
  });
};





module.exports = actions;
