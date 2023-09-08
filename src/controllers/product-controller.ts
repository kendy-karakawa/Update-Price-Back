import productService from "@/services/product-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

async function updateProductValues(req: Request, res: Response) {
    const data = req.body
    try {
        await productService.updateProductValues(data)
        res.sendStatus(httpStatus.OK)
    } catch (error) {
        console.log(error)
    }
}

const productController = {
    updateProductValues
}

export default productController