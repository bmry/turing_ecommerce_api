/**
 * mappings.js
 * This file is the entry to the controller.
 * It requires express server and defines the actions to
 * all the order route.
 */

"use strict";

const router = require("express").Router({ mergeParams: true });
const validator = require("utils/validators");
const checkAndVerifyToken = require("middlewares/checkAndVerifyToken");
const { catchError } = require("utils/handlers");
const actions = require("./actions");
const cache = require("utils/cache");

router.post("/addOrder", validator.validateNewOrder, checkAndVerifyToken, actions.addOrder);

router.get("/getOrder/:order_id([0-9]+)", checkAndVerifyToken, cache, actions.getOrder);

router.get("/getOrders", checkAndVerifyToken, actions.getOrders);

router.put(
  "/cancelOrder/:order_id([0-9]+)",
  validator.validateCancelOrder,
  checkAndVerifyToken,
  actions.cancelOrder
);

module.exports = router;
