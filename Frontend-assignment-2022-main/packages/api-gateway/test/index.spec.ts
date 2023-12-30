//Require the dev-dependencies
import chai from "chai";

import chaiHttp from "chai-http";

import app from "..";
import nock from "nock";

chai.use(chaiHttp);

describe("API testing", () => {
  /*
   * Test the /GET route
   */
  const apiBaseUrl = process.env.API_BASE_URL ?? "";
  const restauntId = 567051;
  const menuName = "mocha";

  describe("/GET restaurants", () => {
    beforeEach(() => {
      nock(apiBaseUrl)
        .get(`/restaurants/${restauntId}.json`)
        .reply(200, { menus: ["coffee", "mocha"] });
      nock(apiBaseUrl)
        .get(`/restaurants/${restauntId}/menus/${menuName}/full.json`)
        .reply(200);
      nock(apiBaseUrl).get(`/restaurants/${restauntId}/menus`).reply(200);
    });

    it("should return response on call", async () => {
      const res = await chai.request(app).get("/");
      chai.expect(res.text).to.eql("LINE MAN Wongnai Frontend Assignment");
    });

    it("it should GET the restaurant detail", async () => {
      const res = await chai.request(app).get(`/restaurants/${restauntId}`);
      chai.expect(res.status).to.eql(200);
    });

    it("it should GET the restaurant all menus", async () => {
      const res = await chai
        .request(app)
        .get(`/restaurants/${restauntId}/menus`);
      chai.expect(res.status).to.eql(200);
    });

    it("it should GET the restaurant single menu", async () => {
      const res = await chai
        .request(app)
        .get(`/restaurants/${restauntId}/menus/${menuName}/full`);
      chai.expect(res.status).to.eql(200);
    });
  });
});
