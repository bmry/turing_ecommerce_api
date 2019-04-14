/**
 * index.js
 * This file contains configurations of the application
 */

 module.exports = {
         dbConfig: {
            host: "Database Host Here",
            user: "Database User Name Here",
            password: "Database Password Here",
            database: "Database Name Here"
         },
         payment: {
                 secret_key: "payment_secrek_key",
                 publishable_key: "payment_publishable_key"
         },
         jwt: {
                "secret": "jwt_secret"
         },
         newrelic: {
                 licenceKey: "new_relic_license_key"
         }
 };
 