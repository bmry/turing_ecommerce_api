/** *
 * Test all customer endpoints
 */


const request = require("supertest");
const app = require("../server");
const { expect } = require("chai");

describe("Customer Registration", () => {
  // POST request to register a customer
  describe("Register a customer", () => {
    it("Should register a customer to the system", (done) => {
      const customerData = {
        email: "morayo@gmail.com",
        name: "Testing API",
        password: "123",
      };
      request(app)
        .post("/api/v1/customers")
        .send(customerData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("Account created successfully");
          return done();
        });
    });
  });

  // POST request to register a customer with an existing email address
  describe("Register a customer with an Existing Emal", () => {
    it("Should throw a message that the email already exist", (done) => {
      const customerData = {
        email: "morayo@gmail.com",
        name: "Testing API",
        password: "123",
      };
      request(app)
        .post("/api/v1/customers")
        .send(customerData)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.equal(
            "The email is already registered. Please choose another one.",
          );
          return done();
        });
    });
  });

  // POST request to login a customer
  describe("Login a customer", () => {
    it("Should login a customer and generate an auth token", (done) => {
      const loginData = {
        email: "morayo@testing.com",
        password: "123",
      };
      request(app)
        .post("/api/v1/customers/login")
        .send(loginData)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal("Login successful");
          expect(res.body.auth).to.be.true;
          expect(res.body.token).to.be.not.empty;
          return done();
        });
    });
  });

  describe("Update customer profile", () => {
    let token = null;
    beforeEach(
      "This gets the auth token and runs before the test below",
      (done) => {
        const loginData = {
          email: "morayo@testing.com",
          password: "123",
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
      },
    );

    // PUT request to update a customer's profile
    it("Should update a customer's profile", (done) => {
      const customerData = {
        address_1: "Test address1",
        city: "Test city",
        region: "Test region",
        postal_code: "12345",
        country: "Test Country",
        shipping_region_id: "1",
        day_phone: "1070122344",
      };
      request(app)
        .put("/api/v1/customer/updateProfile")
        .send(customerData)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.auth).to.be.true;
          expect(res.body.message).to.equal("Profile updated successfully");
          return done();
        });
    });
  });
});
