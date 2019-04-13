
"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");

//Check to make sure header is not undefined, if so, return Forbidden (403).
//If authorization is set, verify it, then move to the next middleware available
const checkAndVerifyToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    jwt.verify(token, config.jwt.secret, function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .json({ auth: false, token: null, message: err.message });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    //If header is undefined return Forbidden (403)
    res.status(403).json({
      auth: false,
      success: false,
      message: "Unauthorized Access. Please log in",
      token: null
    });
  }
};

module.exports = checkAndVerifyToken;
