/**
 * actions.js
 * This is the file that will handle product {items} related
 * actions.
 */


const { validationResult } = require("express-validator/check");
const logger = require("config/winston");
const Product = require("../Models/product");

const actions = {};
const model = new Product();

// Function to calculate offset for pagination
function paginate(page, limit) {
  let _page = parseInt(page, 10); // convert to an integer
  if (isNaN(_page) || _page < 1) {
    _page = 1;
  }
  let _limit = parseInt(limit, 10); // convert to an integer

  // be sure to cater for all possible cases
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
    page: _page,
  };
}

// GET all products and paginate the result
actions.getProducts = (req, res) => {

  const { limit, page } = req.query;
  const { _limit, offset } = paginate(page, limit);
  const pageOptions = {
    limit: _limit,
    offset,
  };

   model.getProductsCount((err, products, totalCount) => {
        if (err) {
            logger.error(err.sqlMessage);
            return res.status(500).json({
                success: false,
                auth: false,
                message: err.sqlMessage,
            });
        }

       model.getProducts(pageOptions, (err, products, count) => {
           if (err) {
               logger.error(err.sqlMessage);
               return res.status(500).json({
                   success: false,
                   auth: false,
                   message: err.sqlMessage,
               });
           }
           res.status(200).json({
               success: true,
               totalCount,
               products,
           });
       });
  });

};

// GET product item information/detal
actions.getProduct = (req, res) => {
  const { product_id } = req.params;
  const id = parseInt(product_id, 10);
  if (product_id && !isNaN(id)) {
    model.getProduct(id, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      }

      let product = result[0];
      res.status(200).json({
        product,
      });
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Product ID should be an integer",
    });
  }
};

// GET products based on the selected department and category, and paginate the result
actions.filterProducts = (req, res) => {
  const {
    limit, page, department_id, category_id,
  } = req.query;
  const { _limit, offset } = paginate(page, limit);
  const pageOptions = {
    department_id,
    category_id,
    offset,
    limit: _limit,
  };
        model.filterProducts(pageOptions, (err, products, count) => {
            if (err) {
                logger.error(err.sqlMessage);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage,
                });
            }
            res.status(200).json({
                count,
                products,
            });
        });
};

// GET a list of products in a category and paginate the result
actions.getProductsCategory = (req, res) => {
  const { category_id } = req.params;
  const { limit, page } = req.query;
  const { _limit, offset } = paginate(page, limit);
  const pageOptions = {
    category_id,
    limit: _limit,
    offset,
  };
  const id = parseInt(category_id, 10);
  if (category_id && !isNaN(id)) {
          model.getProductsCategory(pageOptions, (err, products, count) => {
              if (err) {
                  logger.error(err.sqlMessage);
                  return res.status(500).json({
                      success: false,
                      message: err.sqlMessage,
                  });
              }
              res.status(200).json({
                  count,
                  rows: products,
              });
          });
  } else {
    res.status(500).json({
      success: false,
      message: "Category ID should be an integer",
    });
  }
};

// GET a list of products in a department
actions.getProductsDepartment = (req, res) => {
  const { department_id } = req.params;
  const { limit, page } = req.query;
  const { _limit, offset } = paginate(page, limit);
  const pageOptions = {
    department_id,
    limit: _limit,
    offset,
  };
  const id = parseInt(department_id, 10);
  if (department_id && !isNaN(id)) {

          model.getProductsDepartment(pageOptions, (err, products, count) => {
              if (err) {
                  logger.error(err.sqlMessage);
                  return res.status(500).json({
                      success: false,
                      message: err.sqlMessage,
                  });
              }
              res.status(200).json({
                  count,
                  products,
              });
          });
  } else {
    res.status(500).json({
      success: false,
      message: "Department ID should be an integer",
    });
  }
};

// GET search results and paginate the result
actions.searchProducts = (req, res) => {
  const { search_term, page, limit } = req.query;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    const { _limit, offset } = paginate(page, limit);
    const filterParams = {
      search_term,
      limit: _limit,
      offset,
    };

    model.searchProduct(filterParams, (err, products, count) => {
              if (err) {
                  logger.error(err.sqlMessage);
                  return res.status(500).json({
                      success: false,
                      message: err.sqlMessage,
                  });
              }
              res.status(200).json({
                  count: count,
                  rows: products,
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

// PUT a request to edit product information
actions.editProduct = (req, res) => {
  const {
    name, description, price, discounted_price,
  } = req.body;
  const { product_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    const filterParams = {
      name,
      description,
      price,
      discounted_price,
      product_id,
    };
    model.editProduct(filterParams, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Product updated successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message: "The product with the ID you entered cannot be found",
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

// DELETE a product
actions.deleteProduct = (req, res) => {
  const { product_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    model.deleteProduct(product_id, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Product deleted successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message: "The product with the ID you entered cannot be found",
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

// POST request to add a category
actions.addCategory = (req, res) => {
  const { name, description, department_id } = req.body;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    const params = {
      name,
      description,
      department_id,
    };
    model.addCategory(params, (err, category) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      }
      return res.status(201).json({
        success: true,
        message: "Category added successfully",
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

// PUT a request to edit category
actions.editCategory = (req, res) => {
  const { name, description, department_id } = req.body;
  const { category_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    const filterParams = {
      name,
      description,
      department_id,
      category_id,
    };
    model.editCategory(filterParams, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Product Category updated successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message:
            "The product category with the ID you entered cannot be found",
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

// DELETE a category
actions.deleteCategory = (req, res) => {
  const { category_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    model.deleteCategory(category_id, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Product category deleted successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message:
            "The product category with the ID you entered cannot be found",
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

// PUT a request to edit category
actions.editDepartment = (req, res) => {
  const { name, description } = req.body;
  const { department_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    const filterParams = {
      name,
      description,
      department_id,
    };
    model.editDepartment(filterParams, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Department updated successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message: "The Department with the ID you entered cannot be found",
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

// DELETE a department
actions.deleteDepartment = (req, res) => {
  const { department_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    model.deleteDepartment(department_id, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Product department deleted successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message:
            "The product department with the ID you entered cannot be found",
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

// POST request to add an attribute
actions.addAttribute = (req, res) => {
  const { name } = req.body;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    model.addAttribute(name, (err, attribute, isFound) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          auth: false,
          message: err.sqlMessage,
        });
      } if (!isFound) {
        return res.status(409).json({
          success: false,
          message: "The attribute has been added already. Please check again.",
        });
      }
      res.status(201).json({
        success: true,
        message: "Attribute added successfully",
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

// PUT a request to edit attribute information
actions.editAttribute = (req, res) => {
  const { name } = req.body;
  const { attribute_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    const filterParams = {
      name,
      attribute_id,
    };
    model.editAttribute(filterParams, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Attribute updated successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message: "The attribute with the ID you entered cannot be found",
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

// DELETE an attribute
actions.deleteAttribute = (req, res) => {
  const { attribute_id } = req.params;
  let errorMessage;
  const errors = validationResult(req)
    .array()
    .map((error) => {
      errorMessage = error.msg;
    });
  if (errors.length < 1) {
    model.deleteAttribute(attribute_id, (err, result) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      } if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Attribute category deleted successfully",
        });
      } if (result.affectedRows === 0) {
        return res.status(200).json({
          success: false,
          message: "The attribute with the ID you entered cannot be found",
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

// GET product item information/detal
actions.getProductAttributes = (req, res) => {
  const { product_id, attribute_id } = req.query;
  const p_id = parseInt(product_id, 10);
  const a_id = parseInt(attribute_id, 10);
  const options = {
    product_id: p_id,
    attribute_id: a_id,
  };
  if (product_id && !isNaN(p_id) && (attribute_id && !isNaN(a_id))) {
    model.getProductAttributes(options, (err, product) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
        });
      }
      res.status(200).json({
        success: true,
        product,
      });
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Attribute and Product ID should be integers",
    });
  }
};


module.exports = actions;
