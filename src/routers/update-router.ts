import validateController from "@/controllers/validate-controller";
import { Router } from "express";

const updateRouter = Router()

updateRouter
    .post("/validate", validateController.validateData)


export default updateRouter;