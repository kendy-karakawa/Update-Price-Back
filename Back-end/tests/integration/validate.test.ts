import app, { init } from "@/app";
import { prisma } from "@/config";
import httpStatus from "http-status";
import supertest from "supertest";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await prisma.pack.deleteMany({});
  await prisma.product.deleteMany({})
  
  await prisma.product.createMany({
      data:[
          { code: 16, name: 'AZEITE  PORTUGUÊS  EXTRA VIRGEM GALLO 500ML', cost_price: 18.44, sales_price: 20.49 },
          { code: 18, name: 'BEBIDA ENERGÉTICA VIBE 2L', cost_price: 8.09, sales_price: 8.99 },
          { code: 19, name: 'ENERGETICO  RED BULL ENERGY DRINK 250ML', cost_price: 6.56, sales_price: 7.29 },
          { code: 20, name: 'ENERGETICO RED BULL ENERGY DRINK 355ML', cost_price: 9.71, sales_price: 10.79 },
          { code: 21, name: 'BEBIDA ENERGÉTICA RED BULL RED EDITION 250ML', cost_price: 10.71, sales_price: 11.71 },
          { code: 22, name: 'ENERGETICO  RED BULL ENERGY DRINK SEM AÇUCAR 250ML', cost_price: 6.74, sales_price: 7.49 },
          { code: 23, name: 'ÁGUA MINERAL BONAFONT SEM GAS 1,5L', cost_price: 2.15, sales_price: 2.39 },
          { code: 24, name: 'FILME DE PVC WYDA 28CMX15M', cost_price: 3.59, sales_price: 3.99 },
          { code: 26, name: 'ROLO DE PAPEL ALUMÍNIO WYDA 30CMX7,5M', cost_price: 5.21, sales_price: 5.79 },
          { code: 1000, name: 'BEBIDA ENERGÉTICA VIBE 2L - 6 UNIDADES', cost_price: 48.54, sales_price: 53.94 },
          { code: 1010, name: 'KIT ROLO DE ALUMÍNIO + FILME PVC WYDA', cost_price: 8.80, sales_price: 9.78 },
          { code: 1020, name: 'SUPER PACK RED BULL VARIADOS - 6 UNIDADES', cost_price: 51.81, sales_price: 57.00 }
      ],skipDuplicates:true
  })

  await prisma.pack.createMany({
      data:
          [
              { pack_id: 1000, product_id: 18, qty: 6 },
              { pack_id: 1010, product_id: 24, qty: 1 },
              { pack_id: 1010, product_id: 26, qty: 1 },
              { pack_id: 1020, product_id: 19, qty: 3 },
              { pack_id: 1020, product_id: 21, qty: 3 }
          ],skipDuplicates:true
      
  })
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