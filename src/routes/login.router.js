import express from "express";
import { renderLogin, handleLogin } from "../controllers/login.controller.js";

const loginRouter = express.Router();

loginRouter.get("/", renderLogin);
loginRouter.post("/", handleLogin);

export default loginRouter;
