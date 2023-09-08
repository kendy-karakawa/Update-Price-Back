import { ProductType } from "@/protocols"
import productRepository from "@/repositories/product-Repository"

async function updateProductValues(data: ProductType[]) {
    for (let item of data){
        await productRepository.updateValue(item)
    }

    return
}



const productService = {
    updateProductValues
}

export default productService