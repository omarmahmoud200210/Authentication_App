import express from "express";
import { handleRefresh } from "../controllers/refresh.controller.js";

const refreshRouter = express.Router();

refreshRouter.get("/", handleRefresh);

export default refreshRouter;
