/**
 * actions.js
 * This is the file that will handle orders related
 * actions.
 */

"use strict";
const { validationResult } = require("express-validator/check");
const Orders = require("../models/orders");
const logger = require("config/winston");
const actions = {},
  model = new Orders();

//Function to calculate offset for pagination
function paginate(page, limit) {
  let _page = parseInt(page, 10); //convert to an integer
  if (isNaN(_page) || _page < 1) {
    _page = 1;
  }
  let _limit = parseInt(limit, 10); //convert to an integer

  //be sure to cater for all possible cases
  if (isNaN(_limit)) {
    _limit = 10;
  } else if (_limit > 50) {
    _limit = 50;
  } else if (_limit < 1) {
    _limit = 1;
  }
  const offset = (_page - 1) * _limit;

  return {
    offset,
    _limit,
    page: _page
  };
}

function generate_random_string(string_length){
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}

//GET all products and paginate the result
actions.getOrders = (req, res) => {
  const { limit, page } = req.query;
  let { _limit, offset } = paginate(page, limit);
  const pageOptions = {
    limit: _limit,
    offset,
    customer_id: req.decoded.id
  };
  model.getOrders(pageOptions, (err, orders, count) => {
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
      count,
      orders
    });
  });
};

//GET order information
actions.getOrder = (req, res) => {
  const { order_id } = req.params;
  const id = parseInt(order_id, 10);
  const params = {
    order_id: id,
    customer_id: req.decoded.id
  };
  if (order_id && !isNaN(id)) {
    model.getOrder(params, (err, order) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage
        });
      }
      res.status(200).json({
        success: true,
        order
      });
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Order ID should be an integer"
    });
  }
};

//UPDATE the status an order to be cancelled
actions.cancelOrder = (req, res) => {
  const { order_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map(error => {
      errorMessage = error.msg;
    });
    const params = {
        order_id,
        customer_id: req.decoded.id
    };
  if (errors.length < 1) {
    model.cancelOrder(params, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage
        });
      } else if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Order has been cancelled successfully"
        });
      } else if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message: "The order with the ID you entered cannot be found"
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: errorMessage
    });
    logger.error(errorMessage);
  }
};

actions.addOrder = (req, res) => {
    let errorMessage;
  const errors = validationResult(req)
    .array()
    .map(error => {
      errorMessage = error.msg;
    });
    req.body.created = new Date();
    req.body.reference = generate_random_string(5);
    req.body.customer_id = req.decoded.id;
  if (errors.length < 1) {
    model.addOrder(req.body, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage
        });
      }
      res.status(201).json({
        success: true,
        message: "Order created successfully"
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
