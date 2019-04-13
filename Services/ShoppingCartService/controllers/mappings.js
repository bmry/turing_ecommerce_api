/**
 * mappings.js
 * This file is the entry to the controller.
 * It requires express server and defines the actions to
 * all the shopping cart route.
 */

"use strict";

const router = require("express").Router({ mergeParams: true });
const validator = require("utils/validators");
const checkAndVerifyToken = require("middlewares/checkAndVerifyToken");
const { catchError } = require("utils/handlers");
const actions = require("./actions");

router.post("/addToCart", validator.validateNewItem, checkAndVerifyToken, actions.addToCart);

module.exports = router;
