
"use strict";

const sql = require("config/database");

/**
 * @description - All database operations for payments
 *
 * @class Payment
 */
class Payment {

/**
 *
 *
 * @param {object} options
 * @param {function} callback
 * @memberof Payment
 */
charge(options, callback) {
    const { amount, currency, order_id, customer_id } = options;
    const params = [amount, currency, order_id, customer_id];
    const query = `INSERT into payments (amount, currency, order_id, customer_id) VALUES (?, ?, ?, ?)`;
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = Payment;
