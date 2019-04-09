"use strict";

const sql = require("config/database");

/**
 * @description - All database operations for orders
 *
 * @class Order
 */
class Order {
  /**
   *
   * @description - GET all orders
   * @param {object} pageOptions
   * @param {function} callback
   * @memberof Orders
   */
  getOrders(pageOptions, callback) {
    const { customer_id, offset, limit } = pageOptions;
    const params = [customer_id, limit, offset];
    const query = `SELECT * FROM orders WHERE customer_id = ? LIMIT ? OFFSET ?`;
    sql.query(query, params, (err, orders) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, orders, orders.length);
    });
  }

  /**
   *
   * @description - GET an order information
   * @param {number} order_id
   * @param {function} callback
   * @memberof Orders
   */
  getOrder(options, callback) {
      const { order_id, customer_id } = options;
    const params = [order_id, customer_id];
    const query = `SELECT * FROM orders WHERE order_id = ? AND customer_id = ?`;
    sql.query(query, params, (err, order) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, order);
    });
  }

  /**
   *
   * @description - Add an order
   * @param {object} order
   * @param {function} callback
   * @memberof Orders
   */
  addOrder(orderData, callback) {
    const { total_amount, created, customer_id, shipping_id, reference} = orderData;
    const params = [total_amount, created, "active", customer_id, shipping_id, reference];
    const query = `INSERT INTO orders (total_amount, created_on, status, customer_id, shipping_id, reference) VALUES (?, ?, ?, ?, ?, ?)`;
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Cancel an order
   * @param {number} order_id
   * @param {function} callback
   * @memberof Orders
   */
  cancelOrder(options, callback) {
      const {customer_id, order_id} = options;
    const params = [0, order_id, customer_id];
    const query = `UPDATE orders SET status = ? WHERE order_id = ? AND customer_id = ?`;
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = Order;
