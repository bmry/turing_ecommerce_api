

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
      added_on,
    } = newItem;
    const params = [
      cart_id,
      product_id,
      attributes,
      quantity,
      buy_now,
      added_on,
    ];
    const query = "INSERT INTO shopping_cart (cart_id, product_id, attributes, quantity, buy_now, added_on) VALUES (?, ?, ?, ?, ?, ?)";
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
    const query = "SELECT * FROM shopping_cart as SC JOIN product as P ON (SC.product_id = P.product_id) WHERE cart_id = ? ORDER BY item_id DESC";
    sql.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      console.log(result);
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Delete an order from the shopping cart
   * @param {number} item_id
   * @param {function} callback
   * @memberof Products
   */
  emptyUnusedCart(callback) {
    const params = [];
    const query = "DELETE FROM shopping_cart WHERE DATEDIFF(CURRENT_DATE, added_on ) > 1";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = ShoppingCart;
