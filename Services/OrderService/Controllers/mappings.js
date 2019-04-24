/**
 * mappings.js
 * This file is the entry to the controller.
 * It requires express server and defines the actions to
 * all the order route.
 */


const router = require("express").Router({ mergeParams: true });
const validator = require("utils/validators");
const checkAndVerifyToken = require("middlewares/checkAndVerifyToken");
const { catchError } = require("utils/handlers");
const cache = require("utils/cache");
const actions = require("./actions");

router.post("/", validator.validateNewOrder, checkAndVerifyToken, actions.addOrder);

router.post("/addOrderDetails", validator.validateNewOrderDetails, checkAndVerifyToken, actions.addOrderDetails);

router.get("/:order_id([0-9]+)", checkAndVerifyToken, cache, actions.getOrderFullDetails);

router.get("/shortDetail/:order_id([0-9]+)", checkAndVerifyToken, cache, actions.getOrderShortDetail);

router.get("/getOrders", checkAndVerifyToken, actions.getOrders);

router.post("/sendOrderDetails", checkAndVerifyToken, validator.validateSendOrderDetails, actions.sendOrderDetailToCustomer);

router.put(
  "/cancelOrder/:order_id([0-9]+)",
  validator.validateCancelOrder,
  checkAndVerifyToken,
  actions.cancelOrder,
);

module.exports = router;
