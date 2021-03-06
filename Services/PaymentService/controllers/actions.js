/**
 * actions.js
 * This is the file that will payments related
 * actions.
 */


const { validationResult } = require("express-validator/check");
const logger = require("config/winston");
const Payment = require("../models/payment");

const config = require("../../../config");
const stripe = require("stripe")(config.payment.secret_key);
const actions = {};
const model = new Payment()

actions.makePayment = (req, res) => {
  let errorMessage;
  const { amount, currency, description } = req.body;
  const currency_ = currency || "USD";
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });

  if (errors.length < 1) {
    req.body.customer_id = req.decoded.id;
    stripe.charges.create(
      {
        amount,
        currency: currency_,
        source: "tok_mastercard", // obtained with Stripe.js
        description
      },
      (err, charge) => {
        if (err) {
          return res.status(400).json({
            success: false,
            lol: false,
            message: err.message,
          });
        }
        req.body.currency = currency_;
        // Save the payment record if payment is successful
        model.charge(req.body, (err, message) => {
          if (err) {
            logger.error(err.sqlMessage);
            return res.status(500).json({
              success: false,
              auth: false,
              message: err.sqlMessage,
            });
          }
          res.status(200).json({
            auth: true,
            message: charge,
            success: charge.paid,
            status: charge.status,
          });

        });
      },
    );
  } else {
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
    logger.error(errorMessage);
  }
};

module.exports = actions;
