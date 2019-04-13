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
                 secret_key: "sk_test_bgPK804aIawIKJk69MWaC9MO",
                 publishable_key: "pk_test_QSrngND1gfPQBGT1a7MxJfSh"
         },
         jwt: {
                "secret": "turingChallenge2019"
         },
         newrelic: {
                 licenceKey: "605f2d8cb091d66c4b0c662afb6d36b2b6849825"
         }
 };
 