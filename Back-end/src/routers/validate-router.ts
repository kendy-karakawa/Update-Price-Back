import validateController from "@/controllers/validate-controller";
import { Router } from "express";

const validateRouter = Router()

validateRouter
    .post("/", validateController.validateData)


export default validateRouter;