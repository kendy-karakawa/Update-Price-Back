import { prisma } from "@/config";

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




const productRepository = {
    findByCode
}

export default productRepository