/***
 * Test all products endpoints
 */

"use strict";

const request = require("supertest");
const app = require("../server");
const { expect } = require("chai");

describe("Product", () => {

  //GET all products
  describe("GET Products", () => {
    it("Should return an array of products", (done) => {
      request(app)
        .get("/api/v1/product/getProducts")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.count).to.equal(10);
          expect(res.body.products).to.be.an("array");
          return done();
        });
    });
  });


  //GET all products with pagination
  describe("GET Products with pagination", () => {
    it("Should return an array of products with page and limit", (done) => {
      request(app)
      .get("/api/v1/product/getProducts?page=3&limit=10")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.count).to.equal(10);
        expect(res.body.products).to.be.an("array");
        return done();
      });
    });
  })
  

  //GET a product information by ID
  describe("GET Product", () => {
    it("Should return only one product record", (done) => {
      request(app)
        .get("/api/v1/product/getProduct/100")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.product).to.be.an("array");
          return done();
        });
    });
  });

  //GET a product information by ID
  describe('GET product (with a non-integer)', () => {
    it("Should show an error if a non-integer is passed", (done) => {
      request(app)
      .get("/api/v1/product/getProduct/test")
      //.expect("Content-Type", /plain/)
      .expect(404, done)
    });
  });

  //GET all products in a category
  describe("GET products category", () => {
    it("Should return all products in a category", (done) => {
      request(app)
      .get("/api/v1/product/inCategory/1")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.products).to.be.an("array");
        return done();
      });
    });
  });

  //GET all products in a department
  describe("GET products department", () => {
    it("Should return all products in a department", (done) => {
      request(app)
      .get("/api/v1/product/inDepartment/1")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.products).to.be.an("array");
        return done();
      });
    });
  });


  //GET the search term from the search result
  describe("Search products", () => {
    it("Should return the search result", (done) => {
      request(app)
      .get("/api/v1/product/searchProducts?search_term=coat")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.products).to.be.an("array");
        return done();
      });
    });
  });
  
});
