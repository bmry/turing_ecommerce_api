/**
 * actions.js
 * This is the file that will handle shopping cart related
 * actions.
 */

"use strict";

const { validationResult } = require("express-validator/check");
const ShoppingCart = require("../models/shoppingcart");
const logger = require("config/winston");
const actions = {},
  model = new ShoppingCart();

//Add to cart
actions.addToCart = (req, res) => {
  let errorMessage;

  const errors = validationResult(req)
    .array()
    .map(error => {
      errorMessage = error.msg;
    });

    req.body.added_on = new Date();
  if (errors.length < 1) {
    model.addToCart(req.body, function(err, result) {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage
        });
      }
      res.status(201).json({
        success: true,
        message: "Item added successfully"
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

module.exports = actions;
