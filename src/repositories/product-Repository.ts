import { prisma } from "@/config";

async function findByCode(code: number) {
    return await prisma.product.findFirst({
        where:{
            code: code
        }
    })
}

const productRepository = {
    findByCode
}

export default productRepository