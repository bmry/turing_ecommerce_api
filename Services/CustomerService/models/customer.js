"use strict";

const sql = require("config/database");

const appRoot = require("app-root-path");

const logger = require("../../../config/winston");

class Customer {
  /**
   *
   * @description - Register a new customer
   * @param {object} data
   * @param {function} callback
   * @memberof Customers
   */
  register(data, callback) {
    const { name, email, password } = data;
    const params = [name, email, password];
    //check if the email already exist in the database
    const checkQuery = `SELECT email FROM customer WHERE email = ?`;
    sql.query(checkQuery, params[1], (err, result) => {
      if (err) {
        return callback(err, null);
      } else if (result.length > 0) {
        //if it finds a matching email address
        return callback(err, null, false);
      } else {
        //perform the insert query
        const query = `INSERT INTO customer (name, email, password) VALUES (?, ?, ?)`;
        sql.query(query, params, (err, customer) => {
          if (err) {
            console.log({ err });
            return callback(err, null);
          }
          return callback(null, customer, true);
        });
      }
    });
  }

  /**
   *
   *@description - Login customer
   * @param {object} credentials
   * @param {function} callback
   * @memberof Customers
   */
  login(credentials, callback) {
    const { email, password } = credentials;
    const params = [email, password];
    const query = `SELECT email, password FROM customer WHERE email = ? AND password = ?`;
    sql.query(query, params, (err, customer) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, customer);
    });
  }

  checkEmail(email, callback) {
    const params = [email];
    const query = `SELECT customer_id, email, password FROM customer WHERE email = ?`;
    sql.query(query, params, (err, customer) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, customer);
    });
  }

  /**
   *
   * @description - Update customer profile
   * @param {object} data
   * @param {function} callback
   * @memberof Customers
   */
  updateProfile(data, callback) {
    const {
      address_1,
      city,
      region,
      postal_code,
      country,
      shipping_region_id,
      day_phone,
      customer_id
    } = data;
    const params = [
      address_1,
      city,
      region,
      postal_code,
      country,
      shipping_region_id,
      day_phone,
      customer_id
    ];
    const query = `UPDATE customer SET address_1 = ?, city = ?, region = ?, postal_code = ?, country = ?, shipping_region_id = ?, day_phone = ? WHERE customer_id = ?`;
    sql.query(query, params, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
}

module.exports = Customer;
