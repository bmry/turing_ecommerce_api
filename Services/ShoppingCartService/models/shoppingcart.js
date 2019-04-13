"use strict";

const sql = require("config/database");

class ShoppingCart {
  /**
   *
   *@description - Add item to cart
   * @param {object} newItem
   * @param {function} callback
   * @memberof ShoppingCart
   */
  addToCart(newItem, callback) {
    const {
      cart_id,
      product_id,
      attributes,
      quantity,
      buy_now,
      added_on
    } = newItem;
    const params = [
      cart_id,
      product_id,
      attributes,
      quantity,
      buy_now,
      added_on
    ];
    const query = `INSERT INTO shopping_cart (cart_id, product_id, attributes, quantity, buy_now, added_on) VALUES (?, ?, ?, ?, ?, ?)`;
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   * @description - List of products in shopping cart
   * @param {number} cart_id
   * @param {function} callback
   * @memberof ShoppingCart
   */
  shoppingCartProducts(cart_id, callback) {
    const params = [cart_id];
    const query = `SELEECT * FROM shopping_cart as SC JOIN product as P ON (SC.product_id = P.product_id) WHERE cart_id = ?`;
    sql.query(query, params, (err, products) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, products);
    });
  }

  /**
   *
   *@description - Delete an order from the shopping cart
   * @param {number} order_id
   * @param {function} callback
   * @memberof Products
   */
  deleteOrder(item_id, callback) {
    const params = [item_id];
    const query = `DELETE FROM shopping_cart WHERE item_id = ?`;
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = ShoppingCart;
