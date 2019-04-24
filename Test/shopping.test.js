/** *
 * Test all shopping cart endpoints
 */


const request = require("supertest");
const app = require("../server");
const { expect } = require("chai");


describe("Shopping Cart", () => {
  let token = null;
  beforeEach(
    "This gets the auth token and runs before the test below",
    (done) => {
      const loginData = {
        email: "morayo@testing.com",
        password: "123",
      };
      request(app)
        .post("/api/v1/customers/_token")
        .send(loginData)
        .end((err, res) => {
          if (err) return done(err);
          token = res.body.token;
          expect(res.body.token).to.be.not.empty;
          return done();
        });
    },
  );

    describe("Empty Unused Shopping Cart", () => {
        it("Should remove shopping that is more than one day old", (done) => {
            request(app)
                .get("/api/v1/shoppingcarts/emptyUnusedCart")
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal("Unused shopping cleared successfully cleared ");
                    return done();
                });
        });
    });
  // POST an item to the shopping cart
  describe("POST Product Item", () => {
    it("Should add an item to the cart", (done) => {
      const cartData = {
        cart_id: 1,
        product_id: 2,
        attributes: "This product is nice",
        quantity: 2,
        buy_now: 1,
        added_on: new Date("2019-01-21 H:i:s"),
      };
      request(app)
        .post("/api/v1/shoppingcart/addToCart")
        .set("Authorization", `Bearer ${token}`)
        .send(cartData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal("Item added successfully");
          return done();
        });
    });
  });



});

