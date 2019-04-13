/**
 * actions.js
 * This is the file that will handle customer related
 * actions.
 */

"use strict";

const { validationResult } = require("express-validator/check");
const Customer = require("../models/customer");
const logger = require("config/winston");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config/index");
const actions = {},
model = new Customer();


actions.registerCustomer = async (req, res) => {
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map(error => {
      errorMessage = error.msg;
    });

  if (errors.length < 1) {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    req.body.password = hashedPassword;
    model.register(req.body, function(err, customer, isFound) {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          auth: false,
          message: err.sqlMessage
        });
      } else if (!isFound) {
        return res.status(409).json({
          success: false,
          message: "The email is already registered. Please choose another one."
        });
      }
      res.status(201).json({
        success: true,
        message: "Account created successfully"
      });
    });
  } else {
    res.status(400).json({
      success: false,
      auth: false,
      message: errorMessage
    });
    logger.error(errorMessage);
  }
};

actions.login = (req, res) => {
  model.checkEmail(req.body.email, async function(err, customer) {
    let errorMessage;
    const errors = validationResult(req)
      .array()
      .map(error => {
        errorMessage = error.msg;
      });
    if (errors.length < 1) {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          auth: false,
          message: err.sqlMessage
        });
      } else if (customer.length === 0 || customer.length < 1) {
        return res.status(500).json({
          success: false,
          auth: false,
          message: "Invalid Email or Password"
        });
      }
      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        customer[0].password
      );
      if (!passwordIsValid)
        return res.status(401).json({
          auth: false,
          success: false,
          token: null,
          message: "Invalid Email or Password"
        });
      const token = jwt.sign(
        { id: customer[0].customer_id, email: customer[0].email },
        config.jwt.secret,
        {
          expiresIn: 86400 // expires in 24 hours
        }
      );
      res.status(200).json({
        success: true,
        auth: true,
        token,
        message: "Login successful"
      });
    } else {
      res.status(400).json({
        success: false,
        message: errorMessage
      });
      logger.error(errorMessage);
    }
  });
};

actions.updateProfile = (req, res) => {
    let errorMessage;
    const errors = validationResult(req)
      .array()
      .map(error => {
        errorMessage = error.msg;
      });

    if (errors.length < 1) {
      req.body.customer_id = req.decoded.id;
      model.updateProfile(req.body, function(err, message) {
        if (err) {
          logger.error(err.sqlMessage);
          return res.status(500).json({
            success: false,
            auth: false,
            message: err.sqlMessage
          });
        }
        res.status(200).json({
          success: true,
          auth: true,
          message: "Profile updated successfully"
        });
      });
    } else {
      res.status(400).json({
        success: false,
        message: errorMessage
      });
      logger.error(errorMessage);
    }
};

actions.getToken = (req, res) => {
  model.checkEmail(req.body.email, async function(err, customer) {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json({
        success: false,
        auth: false,
        message: err.sqlMessage
      });
    } else if (customer.length === 0 || customer.length < 1) {
      return res.status(500).json({
        success: false,
        auth: false,
        message: "Invalid Email or Password"
      });
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      customer[0].password
    );
    if (!passwordIsValid)
      return res.status(401).json({
        auth: false,
        success: false,
        token: null,
        message: "Invalid Email or Password"
      });
    const token = jwt.sign(
      { id: customer[0].customer_id, email: customer[0].email },
      config.jwt.secret,
      {
        expiresIn: 86400 // expires in 24 hours
      }
    );
    res.status(200).json({
      success: true,
      auth: true,
      token,
    });
  });
};

module.exports = actions;
