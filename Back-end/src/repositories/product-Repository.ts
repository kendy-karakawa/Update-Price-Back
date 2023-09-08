import { prisma } from "@/config";
import { ProductType } from "@/protocols";

async function findByCode(code: number) {
    const product = await prisma.product.findFirst({
        where:{
            code: code
        },
        include:{
            packsAsPack:true,
            packs: true
        }
    })

    if(!product) return null

    if(product.packs.length === 0 && product.packsAsPack.length === 0){
        return {
            name: product.name,
            cost_price: product.cost_price,
            sales_price: product.sales_price,
            is_pack: false
        }
    }

    return {
        name: product.name,
            cost_price: product.cost_price,
            sales_price: product.sales_price,
            is_pack: true
    }
    
}

async function updateValue(product: ProductType) {
    return await prisma.product.update({
        where: {
            code: product.product_code
        },
        data:{
            sales_price: product.new_price
        }
    })
    
}




const productRepository = {
    findByCode,
    updateValue
}

export default productRepository