

const sql = require("config/database");

/**
 * @description - All database operations for products
 *
 * @class Product
 */
class Product {
  /**
   *
   * @description - GET all product items
   * @param {object} pageOptions
   * @param {function} callback
   * @memberof Products
   */
  getProducts(pageOptions, callback) {
    const { offset, limit } = pageOptions;
    const params = [limit, offset];
    const query = "SELECT * FROM product LIMIT ? OFFSET ?";
    sql.query(query, params, (err, products) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, products, products.length);
    });
  }

  /**
   *
   * @description - GET total products count
   * @param {object} pageOptions
   * @param {function} callback
   * @memberof Products
   */
  getProductsCount(callback) {
    const query = "SELECT * FROM product";
    sql.query(query, [], (err, products) => {
      if (err) {
        return callback(err, null);
      }
      console.log("DBCount"+products.length);
      return callback(null, products, products.length);
    });
  }




  /**
   *
   * @description - Filter product items by department and category
   * @param {object} filterParams
   * @param {function} callback
   * @memberof Products
   */
  filterProducts(filterParams, callback) {
    const {
      department_id, category_id, limit, offset,
    } = filterParams;
    const params = [category_id || 1, department_id || 1, limit, offset];
    const query = "SELECT * FROM product_category as PC JOIN product as P ON (PC.product_id = P.product_id) JOIN category as C ON (PC.category_id = C.category_id) JOIN department as D ON (C.department_id = D.department_id)  WHERE C.category_id = ? AND D.department_id = ? LIMIT ? OFFSET ?";
    sql.query(query, params, (err, products) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, products, products.length);
    });
  }

  /**
   *
   * @description - Search products
   * @param {object} filterParams
   * @param {function} callback
   * @memberof Products
   */
  searchProduct(filterParams, callback) {
    const { search_term, limit, offset } = filterParams;
    const params = [`${search_term}%`,  limit, offset];
    const query = "SELECT * FROM product WHERE name LIKE ? OR description regexp '(^|[[:space:]])"+search_term.replace(/\'/gi,'')+"([[:space:]]|$)' LIMIT ? OFFSET ?";
    sql.query(query, params, (err, products) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, products, products.length);
    });
  }

  /**
   *
   * @description - GET a product item detail
   * @param {number} product_id
   * @param {function} callback
   * @memberof Products
   */
  getProduct(product_id, callback) {
    const params = [product_id];
    const query = "SELECT * FROM product WHERE product_id = ?";
    sql.query(query, params, (err, product) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, product);
    });
  }

  /**
   * @description - GET all products in a category
   * @param {object} filterParams
   * @param {function} callback
   * @memberof Products
   */
  getProductsCategory(filterParams, callback) {
    const { category_id, limit, offset } = filterParams;
    const params = [category_id, limit, offset];
    const query = "SELECT * FROM product_category as PC JOIN product as P ON (PC.product_id = P.product_id) WHERE category_id = ? LIMIT ? OFFSET ?";
    sql.query(query, params, (err, products) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, products, products.length);
    });
  }

  /**
   *
   * @description - GET all products in a department
   * @param {object} filterParams
   * @param {function} callback
   * @memberof Products
   */
  getProductsDepartment(filterParams, callback) {
    const { department_id, limit, offset } = filterParams;
    const params = [department_id, limit, offset];
    const query = "SELECT * FROM product_category as PC JOIN product as P ON (PC.product_id = P.product_id) JOIN category as C ON (PC.category_id = C.category_id) JOIN department as D ON (C.department_id = D.department_id)  WHERE D.department_id = ? LIMIT ? OFFSET ?";
    sql.query(query, params, (err, products) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, products, products.length);
    });
  }

  /**
   *
   * @description - Add a product
   * @param {object} product
   * @param {function} callback
   * @memberof Products
   */
  addProduct(productData, callback) {
    const {
      name, description, price, image,
    } = productData;
    const params = [name, description, price, image];
    const query = "INSERT INTO product (name, description, price, image) VALUES (?, ?, ?, ?)";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   * @description - Edit product information
   * @param {object} productData
   * @param {function} callback
   * @memberof Products
   */
  editProduct(productData, callback) {
    const {
      name,
      description,
      price,
      discounted_price,
      product_id,
    } = productData;
    const params = [name, description, price, discounted_price, product_id];
    const query = "UPDATE product SET name = ?, description = ?, price = ?, discounted_price = ? WHERE product_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Delete a product
   * @param {number} product_id
   * @param {function} callback
   * @memberof Products
   */
  deleteProduct(product_id, callback) {
    const params = [product_id];
    const query = "DELETE FROM product WHERE product_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Add a category
   * @param {object} categoryData
   * @param {function} callback
   * @memberof Products
   */
  addCategory(categoryData, callback) {
    const { name, description, department_id } = categoryData;
    const params = [name, description, department_id];
    const query = "INSERT INTO category (name, description, department_id) VALUES (?, ?, ?)";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Edit a category
   * @param {object} categoryData
   * @param {function} callback
   * @memberof Products
   */
  editCategory(categoryData, callback) {
    const {
      name, description, department_id, category_id,
    } = categoryData;
    const params = [name, description, department_id, category_id];
    const query = "UPDATE category SET name = ?, description = ?, department_id = ? WHERE category_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Delete a category
   * @param {number} categoryId
   * @param {function} callback
   * @memberof Products
   */
  deleteCategory(category_d, callback) {
    const params = [category_d];
    const query = "DELETE FROM category WHERE category_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Add a department
   * @param {object} departmentData
   * @param {function} callback
   * @memberof Products
   */
  addDepartment(departmentData, callback) {
    const { name, description } = departmentData;
    const params = [name, description];
    const query = "INSERT INTO department (name, description) VALUES (?, ?)";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Edit a department
   * @param {object} deparmentData
   * @param {function} callback
   * @memberof Products
   */
  editDepartment(departmentData, callback) {
    const { name, description, department_id } = departmentData;
    const params = [name, description, department_id];
    const query = "UPDATE department SET name = ?, description = ? WHERE department_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *@description - Delete a department
   * @param {number} departmentId
   * @param {function} callback
   * @memberof Products
   */
  deleteDepartment(departmentId, callback) {
    const params = [departmentId];
    const query = "DELETE FROM department WHERE department_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *
   * @param {string} name
   * @param {function} callback
   * @memberof Products
   */
  addAttribute(name, callback) {
    const params = [name];
    const query = "INSERT INTO attribute (name) VALUES (?)";

    // check if the attribute already exist in the database
    const checkQuery = "SELECT name FROM attribute WHERE name = ?";
    sql.query(checkQuery, name, (err, result) => {
      if (err) {
        return callback(err, null);
      } if (result.length > 0) {
        // if it finds a matching email address
        return callback(err, null, false);
      }
      // perform the insert query
      const query = "INSERT INTO attribute (name) VALUES (?)";
      sql.query(query, params, (err, attribute) => {
        if (err) {
          console.log({ err });
          return callback(err, null);
        }
        return callback(null, attribute, true);
      });
    });
  }

  /**
   *
   *
   * @param {number} attr_id
   * @param {function} callback
   * @memberof Products
   */
  editAttribute(options, callback) {
    const { name, attribute_id } = options;
    const params = [name, attribute_id];
    const query = "UPDATE attribute SET name = ? WHERE attribute_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *
   * @param {number} attr_id
   * @param {function} callback
   * @memberof Products
   */
  deleteAttribute(attribute_id, callback) {
    const params = [attribute_id];
    const query = "DELETE FROM attribute WHERE attribute_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   *
   *
   * @param {number} product_id
   * @param {function} callback
   * @memberof Products
   */
  getProductAttributes(param, callback) {
    const { product_id, attribute_id } = param;
    const params = [product_id, attribute_id];
    const query = "SELECT * FROM product as P JOIN product_attribute as PA ON (P.product_id = PA.product_id) JOIN attribute as A ON (A.attribute_id = PA.attribute_value_id) WHERE P.product_id = ? AND A.attribute_id = ?";
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = Product;
