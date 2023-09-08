import express, { Express } from "express";
import cors from "cors";
import { connectDB, disconnectDB, loadEnv } from "./config";
import validateRouter from "./routers/validate-router";
import productRouter from "./routers/product-router";


loadEnv();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/test", (_req, res) => res.send("hello!"));
app.use("/validate", validateRouter)
app.use("/product", productRouter)

export function init(): Promise<Express> {
  connectDB();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
