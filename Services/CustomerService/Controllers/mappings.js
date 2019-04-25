/**
 * mappings.js
 * This file is the entry to the controller.
 * It requires express server and defines the actions to
 * all the customer route.
 */


const router = require("express").Router({ mergeParams: true });
const validator = require("utils/validators");
const checkAndVerifyToken = require("middlewares/checkAndVerifyToken");
const { catchError } = require("utils/handlers");
const actions = require("./actions");

router.post(
  "/",
  validator.validateNewCustomer,
  actions.registerCustomer,
);

router.post("/login", validator.validateLogin, actions.login);

router.put(
  "/",
  validator.validateUpdateProfile,
  checkAndVerifyToken,
  actions.updateProfile,
);

router.post("/token_", validator.validateLogin, actions.getToken);

module.exports = router;
