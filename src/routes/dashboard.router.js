import express from "express";
import { renderDashboard } from "../controllers/dashboard.controller.js";
import verifyJWT from "../services/jwt.js";

const dashboardRouter = express.Router();

dashboardRouter.use(verifyJWT);

dashboardRouter.get("/", renderDashboard);

export default dashboardRouter;