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
        .reply(200, {
          name: "ลืมเคี้ยว",
          id: 567051,
          coverImage:
            "https://img.wongnai.com/p/1920x0/2021/08/14/f6ae0252eb0d44b79553c0dba6e56cfe.jpg",
          activeTimePeriod: {
            open: "10:30",
            close: "20:00",
          },
          menus: [menuName],
        });
      nock(apiBaseUrl)
        .get(`/restaurants/${restauntId}/menus/${menuName}/full.json`)
        .reply(200);
      nock(apiBaseUrl)
        .get(`/restaurants/${restauntId}/menus/${menuName}/short.json`)
        .reply(200, {
          data: {
            name: menuName,
            id: menuName,
            thumbnailImage:
              "https://img.wongnai.com/p/100x100/2021/01/30/e0ba0ea6d9d4465eb8c1db88806ce3f9.jpg",
            discountedPercent: 0,
            fullPrice: 80,
            sold: 100,
            totalInStock: 200,
          },
        });
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
