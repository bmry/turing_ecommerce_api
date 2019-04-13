/**
 * database.js
 * This file is a database connetion wrapper that will be used by other modules.
 */

"use strict";

 const mysql = require("mysql");

 const config = require("../config");

//the database connection
const connection = mysql.createConnection({
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    database: config.dbConfig.database,
    debug: false
  });

connection.connect(err => {
    if (err) {
        throw new Error(err);
    }
});

module.exports = connection;