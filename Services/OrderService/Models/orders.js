

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
    const query = "SELECT * FROM orders WHERE customer_id = ? LIMIT ? OFFSET ?";
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
   * @param {number} options
   * @param {function} callback
   * @memberof Orders
   */
  getOrder(options, callback) {
    const params = options;
    const query = "SELECT * FROM orders WHERE order_id = ?";
    sql.query(query, params, (err, order) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, order);
    });
  }

  /**
   *
   * @description - GET an order information
   * @param {number} options
   * @param {function} callback
   * @memberof Orders
   */
  getOrderDetails(options, callback) {
    const { order_id } = options;
    const params = [order_id];
    const query = "SELECT * FROM order_detail WHERE order_id = ?";
    sql.query(query, params, (err, order) => {
      if (err) {
        return callback(err, null);
      }
      return order;
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
    const {
      total_amount, created, customer_id, shipping_id, reference,tax_id
    } = orderData;
    const params = [total_amount, created, "active", customer_id, shipping_id, reference, tax_id];
    const query = "INSERT INTO orders (total_amount, created_on, status, customer_id, shipping_id, reference, tax_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   * @description - Add an order
   * @param {object} orderData
   * @param {function} callback
   * @memberof Orders
   */
  addOrderDetails(orderData, callback) {
    const {
       order_id, product_id, attributes, product_name, quantity, unit_cost
    } = orderData;
    const params = [order_id, product_id, attributes, product_name, quantity, unit_cost];
    const query = "INSERT INTO order_detail (order_id, product_id, attributes, product_name, quantity, unit_cost) VALUES (?, ?, ?, ?, ?, ?)";
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
    const { customer_id, order_id } = options;
    const params = [0, order_id, customer_id];
    const query = "UPDATE orders SET status = ? WHERE order_id = ? AND customer_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

/**
 *
 * @description - Update order
 * @param order_id
 * @param {object} data
 * @param callback
 * @param {function} callback
 * @memberof Order
 */
updateOrderStatus(data, callback) {
        const {
        order_id,
        status,
    } = data;
    const params = [
        order_id,
        status,
    ];
    const query = "UPDATE orders SET status = ? WHERE order_id = ?";
    sql.query(query, params, (err, result) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, result);
    });
}
}
module.exports = Order;
