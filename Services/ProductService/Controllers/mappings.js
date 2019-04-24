/**
 * mappings.js
 * This file is the entry to the controller.
 * It requires express server and defines the actions to
 * all the product {item} route.
 */


const router = require("express").Router({ mergeParams: true });
const validator = require("utils/validators");
const { catchError } = require("utils/handlers");
const cache = require("utils/cache");
const actions = require("./actions");

router.get("/", cache, actions.getProducts);

router.get("/filter", cache, actions.filterProducts);

router.get(
  "/search",
  validator.validateSearchTerm,
  actions.searchProducts,
);

router.get("/:product_id([0-9]+)", cache, actions.getProduct);

router.get(
  "/inCategory/:category_id([0-9]+)",
  cache,
  actions.getProductsCategory,
);

router.get(
  "/inDepartment/:department_id([0-9]+)",
  cache,
  actions.getProductsDepartment,
);

router.put(
  "/edit/:product_id([0-9]+)",
  validator.validateEditProduct,
  actions.editProduct,
);

router.delete(
  "/deleteProduct/:product_id([0-9]+)",
  validator.validateDeleteProduct,
  actions.deleteProduct,
);

router.put(
  "/editCategory/:category_id([0-9]+)",
  validator.validateEditCategory,
  actions.editCategory,
);

router.delete(
  "/deleteCategory/:category_id([0-9]+)",
  validator.validateDeleteCategory,
  actions.deleteCategory,
);

router.put(
  "/editDepartment/:department_id([0-9]+)",
  validator.validateEditDepartment,
  actions.editDepartment,
);

router.delete(
  "/deleteDepartment/:department_id([0-9]+)",
  validator.validateDeleteDepartment,
  actions.deleteDepartment,
);

router.post(
  "/addAttribute",
  validator.validateNewAttribute,
  actions.addAttribute,
);

router.put(
  "/editAttribute/:attribute_id",
  validator.validateEditAttribute,
  actions.editAttribute,
);

router.delete(
  "/deleteAttribute/:attribute_id",
  validator.validateDeleteAttribute,
  actions.deleteAttribute,
);

router.get(
  "/getProductAttributes",
  validator.validateProductAttributes,
  actions.getProductAttributes,
);

module.exports = router;
