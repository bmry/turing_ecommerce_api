/***
 * Test all orders endpoints
 */

"use strict";

const request = require("supertest");
const app = require("../server");
const { expect } = require("chai");

describe("Customer Orders", () => {

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

    //POST an order
    describe("POST Product Item", () => {
      it("Should add an item to the cart", done => {
        const orderData = {
          total_amount: 1000,
          shipping_id: 1
        };
        request(app)
          .post("/api/v1/order/addOrder")
          .set("Authorization", "Bearer " + token)
          .send(orderData)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).to.be.true;
            expect(res.body.message).to.equal("Order created successfully");
            return done();
          });
      });
    });

  //GET all orders
  describe("GET Orders", () => {
    it("Should return an array of orders", (done) => {
      request(app)
        .get("/api/v1/order/getOrders")
        .set("Authorization", "Bearer " + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.orders).to.be.an("array");
          return done();
        });
    });
  });
  

  //GET an order information by ID
  // describe("GET Order", () => {
  //   it("Should return only one order information", (done) => {
  //     request(app)
  //       .get("/api/v1/order/getOrder/1")
  //       .set("Authorization", "Bearer " + token)
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.body.success).to.be.true;
  //         expect(res.body.product).to.be.an("array");
  //         return done();
  //       });
  //   });
  // });

  //GET a order information by ID
  describe('GET order (with a non-integer)', () => {
    it("Should show an error if a non-integer is passed", (done) => {
      request(app)
      .get("/api/v1/order/getOrder/test")
      .set("Authorization", "Bearer " + token)
      .expect(404, done)
    });
  });
  
});
