import {
  DataWithValidField,
  Pack,
  UnverifiedData,
  VerifildData,
} from "@/protocols";
import packRepository from "@/repositories/pack-repository";
import productRepository from "@/repositories/product-Repository";
import { valid } from "joi";

async function validateData(data: UnverifiedData[]) {
  let verifiedDatas = [];
  let unverifiedPacks = [];

  for (let obj of data) {
    const verifiedObj: VerifildData = await validateAllFieldsExist(obj);
    if (verifiedObj.is_pack === true && verifiedObj.valid === true) {
      unverifiedPacks.push(verifiedObj);
    } else {
      verifiedDatas.push(verifiedObj);
    }
  }

  const verifildPack = await validatePackRules(unverifiedPacks);
  const result = [ ...verifiedDatas, ...verifildPack]

  return result;
}

async function validateAllFieldsExist(object: UnverifiedData) {
  if (!object.new_price) {
    return {
      ...object,
      valid: false,
      error: "O novo preço não foi informado",
    };
  }

  if (isNaN(+object.new_price)) {
    return {
      ...object,
      valid: false,
      error: "O novo preço não é um numero valido",
    };
  }

  if (!object.product_code) {
    return {
      ...object,
      valid: false,
      error: "O codigo do produto não foi informado",
    };
  }

  if (isNaN(+object.product_code)) {
    return {
      ...object,
      valid: false,
      error: "O codigo do produto não é um numero valido",
    };
  }

  const newObj = {
    new_price: +object.new_price,
    product_code: +object.product_code,
  };

  return await validateProductCode(newObj);
}

async function validateProductCode(object: DataWithValidField) {
  const product = await productRepository.findByCode(object.product_code);
  if (!product)
    return {
      ...object,
      valid: false,
      error: "O codigo do produto não existe",
    };

  return await compareWithCostValue(object, product);
}

async function compareWithCostValue(object: DataWithValidField, product) {
  if (object.new_price < +product.cost_price) {
    return {
      ...object,
      valid: false,
      error: "O preço esta abaixo do custo",
      is_pack: product.is_pack,
      name: product.name,
      sales_price: product.sales_price,
    };
  }

  if (object.new_price < +product.sales_price * 0.9) {
    return {
      ...object,
      valid: false,
      error: "O preço esta com desconto de mais de 10% do preço atual",
      is_pack: product.is_pack,
      name: product.name,
      sales_price: product.sales_price,
    };
  }

  if (object.new_price > +product.sales_price * 1.1) {
    return {
      ...object,
      valid: false,
      error: "O preço esta mais de 10% do preço atual",
      is_pack: product.is_pack,
      name: product.name,
      sales_price: product.sales_price,
    };
  }

  return {
    ...object,
    valid: true,
    is_pack: product.is_pack,
    name: product.name,
    sales_price: product.sales_price,
  };
}



async function validatePackRules(unverifiedPacks: VerifildData[]) {
  const verifiedDatas = [];

  for (let item of unverifiedPacks) {
    const result = await validatePriceAndFileExistence(item, unverifiedPacks);
    verifiedDatas.push(result);
  }

  return verifiedDatas;
}

async function validatePriceAndFileExistence(
  object: VerifildData,
  unverifiedPacks: VerifildData[]
) {
  const productCodesInData = unverifiedPacks.map((item) => item.product_code);
  //[ 18, 1000 ]

  const productCode = Number(object.product_code);
  const newPrice = Number(object.new_price)

  const isPack = await packRepository.isPack(productCode);
  if (isPack) {
    const components = await packRepository.getComponents(productCode);
    if (
      !components.some((pack) => productCodesInData.includes(Number(pack.code)))
    )
      return {
        ...object,
        valid: false,
        error: "Produto componente ausente no arquivo.",
      };

      //--------------------------------------------------------------------------------------//
      if(newPrice !== await sumPackComponents(unverifiedPacks, components )){
        return {
                ...object,
                valid: false,
                error: "Preço da soma dos components diferente do preço do pacote.",
                };
      }

      //--------------------------------------------------------------------------------------//
  } else {
    const relatedPack = await packRepository.getRelatedPacks(productCode);
    
    if (!productCodesInData.includes(Number(relatedPack.code))) {
      return {
        ...object,
        valid: false,
        error: "Prodito tipo Pack ausente no arquivo.",
      };
    }
    //--------------------------------------------------------------------------------------//
    if(!await checkSumOfComponentsWithPack(unverifiedPacks, relatedPack ))
    return {
      ...object,
      valid: false,
      error: "Preço da soma dos components diferente do preço do pacote.",
    };

    //--------------------------------------------------------------------------------------//
  }

  return {
    ...object,
    valid: true,
  };
}

async function sumPackComponents(unverifiedPacks: VerifildData[] , components){
  let sumValues = 0
  
  
  //Verificar na lista "unverifiedPacks" quais sao id de components
  const componentsInData = unverifiedPacks.filter(pack => 
      components.some(component => Number(component.code) === Number(pack.product_code))
  );
  
  
  //Verificar a quantidade desse componente no pacote e fazer quantidade x new_price e somar com sumValues
  for(let item of componentsInData){
    const qty = await packRepository.getQtyByComponentId(Number(item.product_code))	
    sumValues += (Number(qty) * Number(item.new_price))
  }
  
  
  //Remover da lista "components" os produtos que estao "componentsInData"
  const restComponents = components.filter(component => 
      componentsInData.some(pack => Number(pack.product_code)!== Number(component.code))
  );
  
  //Verificar a quantidade e o sales_prisce do component e fazer quantidade x sales_prisce e somar com sumValues
  
  for(let item of restComponents){
    const value = await productRepository.getComponentOfPackValue(item.code)
    sumValues += value
  }
  
  
  return sumValues 
}

async function checkSumOfComponentsWithPack(unverifiedPacks: VerifildData[], relatedPack ){
  //filtrar o unverifiedPacks para ficar apenas o pack
  const packInData = unverifiedPacks.find(item => Number(item.product_code) === Number(relatedPack.code))
  const packNewPrice = packInData.new_price
  let sumValues = 0
  
  //Pegar os componentes do packInData
  const components = await packRepository.getComponents(Number(packInData.product_code))
  
  //Verificar na lista "unverifiedPacks" quais sao id de components
  const componentsInData = unverifiedPacks.filter(pack => 
        components.some(component => Number(component.code) === Number(pack.product_code))
    );
  
  //Verificar a quantidade desse componente no pacote e fazer quantidade x new_price e somar com sumValues
    for(let item of componentsInData){
      const qty = await packRepository.getQtyByComponentId(Number(item.product_code))	
      sumValues += (Number(qty) * Number(item.new_price))
    }
  
  //Remover da lista "components" os produtos que estao "componentsInData"
    const restComponents = components.filter(component => 
        componentsInData.some(pack => Number(pack.product_code)!== Number(component.code))
    );
    
  //Verificar a quantidade e o sales_prisce do component e fazer quantidade x sales_prisce e somar com sumValues
    for(let item of restComponents){
      const value = await productRepository.getComponentOfPackValue(Number(item.code))
      sumValues += value
    }

    return (sumValues ===  packNewPrice)

  }



const validateService = {
  validateData,
};

export default validateService;
