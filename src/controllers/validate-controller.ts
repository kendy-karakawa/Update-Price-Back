import validateService from "@/services/validate-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

async function validateData(req: Request, res: Response) {
    const data = req.body
    try {
        const verifiedDatas = await validateService.validateData(data)
        res.status(httpStatus.OK).send(verifiedDatas)
    } catch (error) {
        console.log(error)
    }
}

const validateController = {
    validateData
}

export default validateController