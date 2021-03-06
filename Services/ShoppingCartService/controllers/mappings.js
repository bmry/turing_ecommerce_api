/**
 * mappings.js
 * This file is the entry to the controller.
 * It requires express server and defines the actions to
 * all the shopping cart route.
 */


const router = require("express").Router({ mergeParams: true });
const validator = require("utils/validators");
const checkAndVerifyToken = require("middlewares/checkAndVerifyToken");
const { catchError } = require("utils/handlers");
const actions = require("./actions");

router.post("/addToCart", validator.validateNewItem, actions.addToCart);

router.get("/emptyUnusedCart",checkAndVerifyToken, actions.emptyUnusedCart);

router.get("/generateUniqueId", checkAndVerifyToken, actions.generateUniqueId);

router.get("/removeProduct/:item_id([0-9]+)", checkAndVerifyToken, actions.removeProductFromCart);

router.get("/:cart_id", checkAndVerifyToken, actions.listCartItems);

module.exports = router;
