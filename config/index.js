/**
 * index.js
 * This file contains configurations of the application
 */
require('dotenv').config();

module.exports = {
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: "",
        database: process.env.DB_NAME,
    },
    payment: {
        secret_key: process.env.PAYMENT_SECRET_KEY,
        publishable_key: process.env.PAYMENT_PUBLISHABLE_KEY,
    },
    jwt: {
        "secret": process.env.JWT_SECRET,
    },
    newrelic: {
        licenceKey: process.env.NEW_RELIC_LICENCE_KEY,
    }
};
 