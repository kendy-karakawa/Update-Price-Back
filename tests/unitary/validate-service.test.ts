import { DataWithValidField, UnverifiedData, VerifildData } from "@/protocols";
import productRepository from "@/repositories/product-Repository";
import validateService from "@/services/validate-service";

describe("Validate service teste suite", () => {
  it("When the new price was not informed", async () => {
    const data: UnverifiedData[] = [{ product_code: 1, new_price: null }];
    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: null,
      valid: false,
      error: "O novo preço não foi informado",
    });
  });

  it("When the new price was not valid number", async () => {
    const data: UnverifiedData[] = [{ product_code: 1, new_price: "novo" }];
    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: "novo",
      valid: false,
      error: "O novo preço não é um numero valido",
    });
  });

  it("When the new price was not valid number", async () => {
    const data: UnverifiedData[] = [{ product_code: null, new_price: 25.50 }];
    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: null,
      new_price: 25.50,
      valid: false,
      error: "O codigo do produto não foi informado",
    });
  });

  it("When the new price was not valid number", async () => {
    const data: UnverifiedData[] = [{ product_code: "um", new_price: 25.50 }];
    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: "um",
      new_price: 25.50,
      valid: false,
      error: "O codigo do produto não é um numero valido",
    });
  });

  it("When the new price was not valid number", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 25.50 }];

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return null
    })


    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 25.50,
      valid: false,
      error: "O codigo do produto não existe",
    });
  });

  it("When the new price was below cost", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 10.00 }];
    const product = {
        code: 1,
        name: "Bala",
        cost_price: 11.09,
        sales_price: 11.99,
        }

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })


    const result = await validateService.validateData(data);
    console.log(result)
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 10.00,
      valid: false,
      error: "O preço esta abaixo do custo",
      name: "Bala",
      sales_price: 11.99,
    });
  });

  it("When the new price was discounted by more than 10% of the current price", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 10.31 }];
    const product = {
        code: 1,
        name: "Bala",
        cost_price: 10.09,
        sales_price: 11.99,
        }

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })


    const result = await validateService.validateData(data);
    console.log(result)
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 10.31,
      valid: false,
      error: "O preço esta com desconto de mais de 10% do preço atual",
      name: "Bala",
      sales_price: 11.99,
    });
  });

  it("When the new price was more than 10% of the current price", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 13.31 }];
    const product = {
        code: 1,
        name: "Bala",
        cost_price: 10.09,
        sales_price: 11.99,
        }

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })


    const result = await validateService.validateData(data);
    console.log(result)
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 13.31,
      valid: false,
      error: "O preço esta mais de 10% do preço atual",
      name: "Bala",
      sales_price: 11.99,
    });
  });
});
