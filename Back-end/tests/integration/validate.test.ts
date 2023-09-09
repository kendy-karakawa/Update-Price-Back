import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";

beforeAll(async () => {
  await init();
});

const server = supertest(app);

describe("POST /validate", ()=>{
    it("should respond with status 200 and validate data",async () => {
        const body = [
            {
                "product_code": 19,
                "new_price": 7.30
              },
            
              {
                "product_code": 1020,
                "new_price": 57.03
              }
        ]

        const result = await server.post("/validate").send(body)
        expect(result.status).toBe(httpStatus.OK)
        expect(result.body).toEqual([
            {
              "new_price": 7.3,
              "product_code": 19,
              "valid": true,
              "is_pack": true,
              "name": "ENERGETICO  RED BULL ENERGY DRINK 250ML",
              "sales_price": "7.29"
            },
            {
              "new_price": 57.03,
              "product_code": 1020,
              "valid": true,
              "is_pack": true,
              "name": "SUPER PACK RED BULL VARIADOS - 6 UNIDADES",
              "sales_price": "57"
            }
          ])
    })
})