/**
 * actions.js
 * This is the file that will handle shopping cart related
 * actions.
 */


const { validationResult } = require("express-validator/check");
const logger = require("config/winston");
const ShoppingCart = require("../models/shoppingcart");
const uuid = require('uuid/v1');

const actions = {};
const model = new ShoppingCart();

// Add to cart
actions.addToCart = (req, res) => {
  let errorMessage;

  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });

  req.body.added_on = new Date();
  if (errors.length < 1) {
    model.addToCart(req.body, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      }
        model.shoppingCartProducts(req.body.cart_id,(err, cart_info) => {
            res.status(200).json({
                cart_info,
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

// Get List of Products in Shopping Cart
actions.listCartItems = (req, res) => {
    let errorMessage;

    const errors = validationResult(req)
        .array()
        .map((error) => {
            errorMessage = error.msg;
        });

    if (errors.length < 1) {
        model.shoppingCartProducts(req.params.cart_id, (err, cart_info) => {
            if (err) {
                logger.error(err.sqlMessage);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage,
                });
            }
            res.status(200).json({
                cart_info,
            });
        });
    }else {
                res.status(400).json({
                    success: false,
                    message: errorMessage,
                });
                logger.error(errorMessage);
            }
    };




// Empty cart
actions.emptyUnusedCart = (req, res) => {
    const errors = validationResult(req)
        .array()
        .map((error) => {
            errorMessage = error.msg;
        });
    if (errors.length < 1) {
        model.emptyUnusedCart((err, result) => {
            if (err) {
                logger.error(err.sqlMessage);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage,
                });
            }
            console.log(result);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Unused shopping cleared successfully cleared ",
                });
            }
            if (result.affectedRows === 0) {
                return res.status(200).json({
                    success: false,
                    message: "No unused shopping shopping cart present",
                });
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: errorMessage,
        });
        logger.error(errorMessage);
    }

};

// Remove item from cart
actions.removeProductFromCart = (req, res) => {
    const errors = validationResult(req)
        .array()
        .map((error) => {
            errorMessage = error.msg;
        });

    if (errors.length < 1) {
        model.removeProductFromCart(req.params.item_id, (err, result) => {
            if (err) {
                logger.error(err.sqlMessage);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage,
                });
            }
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "The item ID: "+ req.params.item_id + "Not found",
                        field: req.params,
                    });
                }else {
                    return res.status(200).json({

                    });
                }
        });
    } else {
        res.status(400).json({
            success: false,
            message: errorMessage,
        });
    }

};

actions.generateUniqueId = (req, res) => {
    const cart_id =  '_' + Math.random().toString(36).substr(2, 9);
    res.status(200).json({
        cart_id: cart_id
    })
};

module.exports = actions;
