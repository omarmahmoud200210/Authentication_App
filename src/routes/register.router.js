import express from "express";
import {
  renderRegister,
  handleRegister,
} from "../controllers/register.controller.js";

const registerRouter = express.Router();

registerRouter.get("/", renderRegister);
registerRouter.post("/", handleRegister);

export default registerRouter;
