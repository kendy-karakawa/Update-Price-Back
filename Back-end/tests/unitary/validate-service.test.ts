import { DataWithValidField, UnverifiedData, VerifildData } from "@/protocols";
import packRepository from "@/repositories/pack-repository";
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
        is_pack: false
        }

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })


    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 10.00,
      valid: false,
      error: "O preço esta abaixo do custo",
      name: "Bala",
      sales_price: 11.99,
      is_pack: false
    });
  });

  it("When the new price was discounted by more than 10% of the current price", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 10.31 }];
    const product = {
        code: 1,
        name: "Bala",
        cost_price: 10.09,
        sales_price: 11.99,
        is_pack: false
        }

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })


    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 10.31,
      valid: false,
      error: "O preço esta com desconto de mais de 10% do preço atual",
      name: "Bala",
      sales_price: 11.99,
      is_pack: false
    });
  });

  it("When the new price was more than 10% of the current price", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 13.31 }];
    const product = {
        code: 1,
        name: "Bala",
        cost_price: 10.09,
        sales_price: 11.99,
        is_pack: false
        }

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })


    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 13.31,
      valid: false,
      error: "O preço esta mais de 10% do preço atual",
      name: "Bala",
      sales_price: 11.99,
      is_pack: false
    });
  });

  it("When you have a package type product, but you don't have the component type product in the same file", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 11.98 }];
    const product = {
        code: 1,
        name: "Pacote de Bala",
        cost_price: 10.09,
        sales_price: 11.99,
        is_pack: true
    }

    const components = [
      {
        code: 2,
        name: 'Bala',
        cost_price: 6.56,
        sales_price: 7.29
      }
    ]

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })

    jest.spyOn(packRepository, "isPack")
    .mockImplementationOnce((): any => {
      return true
    })

    jest.spyOn(packRepository, "getComponents")
    .mockImplementationOnce((): any => {
      return components
    })

    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 1,
      new_price: 11.98,
      valid: false,
      error: "Produto componente ausente no arquivo.",
      name: "Pacote de Bala",
      sales_price: 11.99,
      is_pack: true
    });
  });

  it("When you have a component type product but don't have pack type product in the same file", async () => {
    const data: UnverifiedData[]  = [ {product_code: 2, new_price: 2.01 }];
    const product = {
      code: 2,
      name: "Bala",
      cost_price: 1.56,
      sales_price: 2.00,
      is_pack: true
    }

    const relatedPack = [
      {
        code: 1,
        name: "Pacote de Bala",
        cost_price: 10.09,
        sales_price: 11.99,
      }
    ]

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return product
    })

    jest.spyOn(packRepository, "isPack")
    .mockImplementationOnce((): any => {
      return false
    })

    jest.spyOn(packRepository, "getRelatedPacks")
    .mockImplementationOnce((): any => {
      return relatedPack
    })

    const result = await validateService.validateData(data);
    expect(result[0]).toEqual({
      product_code: 2,
      new_price: 2.01,
      valid: false,
      error: "Produto tipo Pack ausente no arquivo.",
      name: "Bala",
      sales_price: 2.00,
      is_pack: true
    });
  });

  it("When you have a package and component type product in the same file, but sum of compenest is diferent of the packege new price", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 11.98 }, {product_code: 2, new_price: 2.01 }];
    
    const firstProduct = {
      code: 1,
      name: "Pacote de Bala",
      cost_price: 10.09,
      sales_price: 11.99,
      is_pack: true
  }
    
    const secondProduct = {
      code: 2,
      name: "Bala",
      cost_price: 1.56,
      sales_price: 2.00,
      is_pack: true
    }

    const components = [
      {
        code: 2,
        name: 'Bala',
        cost_price: 6.56,
        sales_price: 7.29
      }
    ]

    const relatedPack = 
      {
        code: 1,
        name: "Pacote de Bala",
        cost_price: 10.09,
        sales_price: 11.99,
      }
    

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return firstProduct
    })

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return secondProduct
    })

    jest.spyOn(packRepository, "isPack")
    .mockImplementationOnce((): any => {
      return true
    })

    jest.spyOn(packRepository, "getComponents")
    .mockImplementationOnce((): any => {
      return components
    })

    jest.spyOn(packRepository, "getQtyByComponentId")
    .mockImplementationOnce((): any => {
      return 6
    })

    jest.spyOn(productRepository, "getComponentOfPackValue")
    .mockImplementationOnce((): any => {
      return 0
    })

    jest.spyOn(packRepository, "isPack")
    .mockImplementationOnce((): any => {
      return false
    })

    jest.spyOn(packRepository, "getRelatedPacks")
    .mockImplementationOnce((): any => {
      return relatedPack
    })

    jest.spyOn(packRepository, "getComponents")
    .mockImplementationOnce((): any => {
      return components
    })

    jest.spyOn(packRepository, "getQtyByComponentId")
    .mockImplementationOnce((): any => {
      return 6
    })

    jest.spyOn(productRepository, "getComponentOfPackValue")
    .mockImplementationOnce((): any => {
      return 0
    })

    const result = await validateService.validateData(data);
    expect(result).toEqual([{
      product_code: 1,
      new_price: 11.98,
      valid: false,
      error: "Preço da soma dos components diferente do preço do pacote.",
      name: "Pacote de Bala",
      sales_price: 11.99,
      is_pack: true
    },
    {
      product_code: 2,
      new_price: 2.01,
      valid: false,
      error: "Preço da soma dos components diferente do preço do pacote.",
      name: "Bala",
      sales_price: 2.00,
      is_pack: true
    }]);
  });

  it("When you have a package and component type product in the same file, and sum of compenest is equal of the packege new price", async () => {
    const data: UnverifiedData[]  = [{ product_code: 1, new_price: 12.00 }, {product_code: 2, new_price: 2.00 }];
    
    const firstProduct = {
      code: 1,
      name: "Pacote de Bala",
      cost_price: 10.09,
      sales_price: 11.99,
      is_pack: true
  }
    
    const secondProduct = {
      code: 2,
      name: "Bala",
      cost_price: 1.56,
      sales_price: 1.99,
      is_pack: true
    }

    const components = [
      {
        code: 2,
        name: 'Bala',
        cost_price: 6.56,
        sales_price: 7.29
      }
    ]

    const relatedPack = 
      {
        code: 1,
        name: "Pacote de Bala",
        cost_price: 10.09,
        sales_price: 11.99,
      }
    

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return firstProduct
    })

    jest
    .spyOn(productRepository, "findByCode")
    .mockImplementationOnce((): any => {
        return secondProduct
    })

    jest.spyOn(packRepository, "isPack")
    .mockImplementationOnce((): any => {
      return true
    })

    jest.spyOn(packRepository, "getComponents")
    .mockImplementationOnce((): any => {
      return components
    })

    jest.spyOn(packRepository, "getQtyByComponentId")
    .mockImplementationOnce((): any => {
      return 6
    })

    jest.spyOn(productRepository, "getComponentOfPackValue")
    .mockImplementationOnce((): any => {
      return 0
    })

    jest.spyOn(packRepository, "isPack")
    .mockImplementationOnce((): any => {
      return false
    })

    jest.spyOn(packRepository, "getRelatedPacks")
    .mockImplementationOnce((): any => {
      return relatedPack
    })

    jest.spyOn(packRepository, "getComponents")
    .mockImplementationOnce((): any => {
      return components
    })

    jest.spyOn(packRepository, "getQtyByComponentId")
    .mockImplementationOnce((): any => {
      return 6
    })

    jest.spyOn(productRepository, "getComponentOfPackValue")
    .mockImplementationOnce((): any => {
      return 0
    })

    const result = await validateService.validateData(data);
    expect(result).toEqual([{
      product_code: 1,
      new_price: 12.00,
      valid: true,
      name: "Pacote de Bala",
      sales_price: 11.99,
      is_pack: true
    },
    {
      product_code: 2,
      new_price: 2.00,
      valid: true,
      name: "Bala",
      sales_price: 1.99,
      is_pack: true
    }]);
  });
});
