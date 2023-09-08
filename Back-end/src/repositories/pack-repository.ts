import { prisma } from "@/config";

async function isPack(productCode: number) {
  const pack = await prisma.pack.findFirst({
    where:{
      pack_id: productCode
    }
  })

  return !!pack
  
}

async function getComponents(packCode: number) {
  const packComponents = await prisma.pack.findMany({
      where: {
          pack_id: packCode
      },
      include: {
          product: true
      }
  });

  return packComponents.map(packComponent => packComponent.product);
}

async function getRelatedPacks(productCode) {
  const relatedPacks = await prisma.pack.findMany({
      where: {
          product_id: productCode
      },
      include: {
          pack: true
      }
  });

  return relatedPacks.map(relatedPack => relatedPack.pack);
}

async function getQtyByComponentId(id: number) {
  const component = await prisma.pack.findFirst({
    where:{
      product_id: id
    }
  })

  return component.qty
}

const packRepository = {
    isPack,
    getComponents,
    getRelatedPacks,
    getQtyByComponentId
};

export default packRepository;
