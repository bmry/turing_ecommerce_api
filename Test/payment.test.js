/***
 * Test checkout endpoint
 */

"use strict";

const request = require("supertest");
const app = require("../server");
const { expect } = require("chai");


describe("Charge Customer", () => {
  
  describe("Checkout Payment", () => {
    var token = null;
    beforeEach(
      "This gets the auth token and runs before the test below",
      done => {
        const loginData = {
          email: "test@gmail.com",
          password: "123"
        };
        request(app)
          .post("/api/v1/customer/token_")
          .send(loginData)
          .end((err, res) => {
            if (err) return done(err);
            token = res.body.token;
            expect(res.body.token).to.be.not.empty;
            return done();
          });
      }
    );
    it("Should charge a customer", function(done) {
        this.timeout(5000);
        const paymentData = {
            order_id: 1,
            amount: 2000,
            //currency: "USD",
            datetime: new Date() 
        };
        request(app)
        .post("/api/v1/payment/charge")
        .send(paymentData)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.auth).to.be.true;
          expect(res.body.message).to.equal("Payment made successfully");
          return done();
        });
    });
  })
  
});
