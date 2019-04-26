

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
      added_on,
    } = newItem;
    const params = [
      cart_id,
      product_id,
      attributes,
      added_on,
      1
    ];

      const query = "SELECT * FROM shopping_cart WHERE cart_id = ? AND product_id = ?";
      sql.query(query, params, (err, result) => {
          if (err) {
              return callback(err, null);
          }
          if(!result.length){
              const query = "INSERT INTO shopping_cart (cart_id, product_id, attributes, added_on, quantity) VALUES (?, ?, ?, ?, ?)";
              sql.query(query, params, (err, result) => {
                  if (err) {
                      return callback(err, null);
                  }
                  return callback(null, result);
              });

          }else {
              const quantity = result[0].quantity + 1;
              const params = [quantity, cart_id, product_id ];
              const query = "UPDATE shopping_cart SET quantity = ? WHERE cart_id = ? AND product_id = ?";
              sql.query(query, params, (err, result) => {
                  if (err) {
                      return callback(err, null);
                  }
                  return callback(null, result);
              });
          }

      });
  }

  getSingleProductFromCart(data, callback){

      sql.query(query, params, (err, result) => {
          if (err) {
              return callback(err, null);
          }

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
    console.log(cart_id);
    const query = "SELECT SC.item_id AS item_id, P.name AS name, SC.attributes as attribues, SC.product_id as product_id, P.price as price, SC.quantity as quantity, CAST(SUM(price * quantity) AS CHAR) as subtotal FROM shopping_cart as SC JOIN product as P ON (SC.product_id = P.product_id) WHERE cart_id = ?  GROUP BY item_id ORDER BY item_id DESC";
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
   * @description - Get total price of product in a cart
   * @param {number} cart_id
   * @param {function} callback
   * @memberof ShoppingCart
   */
  shoppingCartProductsTotalPrice(cart_id, callback) {
    const params = [cart_id];
    const query = "SELECT SC.cart_id AS cart_id, CAST(SUM(price * quantity) AS CHAR) as subtotal FROM shopping_cart as SC JOIN product as P ON (SC.product_id = P.product_id) WHERE cart_id = ?  GROUP BY cart_id ";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Empty unused cart
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

  /**
   *
   *@description - Delete an order from the shopping cart
   * @param {number} item_id
   * @param {function} callback
   * @memberof Products
   */
  removeProductFromCart(item_id, callback) {
    const params = [item_id];
    const query = "DELETE FROM shopping_cart WHERE item_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = ShoppingCart;
