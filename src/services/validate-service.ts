import { DataWithValidField, UnverifiedData } from "@/protocols";
import productRepository from "@/repositories/product-Repository";

async function validateData(data: UnverifiedData[]) {
    let verifiedDatas = []
    for (let obj of data){
        const verifiedObj = await validateAllFieldsExist(obj)
        verifiedDatas.push(verifiedObj)
    }

    return verifiedDatas
}

async function validateAllFieldsExist(object: UnverifiedData) {

    if(!object.new_price ){
        return {
            ...object,
            valid: false,
            error: "O novo preço não foi informado"            
        }
    }

    if(isNaN(+object.new_price)){
        return {
            ...object,
            valid: false,
            error: "O novo preço não é um numero valido"            
        }
    }
    
    if(!object.product_code){
         return {
            ...object,
            valid:false,
            error: "O codigo do produto não foi informado" 
        }
    }

    if(isNaN(+object.product_code)){
        return {
           ...object,
           valid:false,
           error: "O codigo do produto não é um numero valido" 
       }
   }

   const newObj = {
    new_price: +object.new_price,
    product_code: +object.product_code
   }

    return await validateProductCode(newObj)
    
    
}

async function validateProductCode(object: DataWithValidField) {
    const product = await productRepository.findByCode(object.product_code)
    if(!product) return {
        ...object,
           valid:false,
           error: "O codigo do produto não existe" 
    }

    return await compareWithCostValue(object, product)
   
}

async function compareWithCostValue(object: DataWithValidField, product) {
    if(object.new_price < +product.cost_price){
        return {
            ...object,
               valid:false,
               error: "O preço esta abaixo do custo",
               name: product.name,
               sales_price: product.sales_price   
        }
    }
    
    if(object.new_price < (+product.sales_price * 0.9)){
        return {
            ...object,
               valid:false,
               error: "O preço esta com desconto de mais de 10% do preço atual",
               name: product.name,
               sales_price: product.sales_price   
        }
    }

    if(object.new_price > (+product.sales_price * 1.1)){
        return {
            ...object,
               valid:false,
               error: "O preço esta mais de 10% do preço atual",
               name: product.name,
               sales_price: product.sales_price   
        }
    }

    //verificar se o produto é um pack ou faz parte de um pack 

}

const validateService = {
    validateData
}

export default validateService