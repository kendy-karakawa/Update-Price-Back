import productController from "@/controllers/product-controller";
import { Router } from "express";

const productRouter = Router()

productRouter.post("/", productController.updateProductValues)

export default productRouter