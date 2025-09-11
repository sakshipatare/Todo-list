import express from "express";
import TeamController from "./team.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const teamRouter = express.Router();
const teamController = new TeamController();

teamRouter.post("/create", authMiddleware, (req, res) =>
  teamController.createTeam(req, res)
);
teamRouter.post("/join", authMiddleware, (req, res) =>
  teamController.joinTeam(req, res)
);

export default teamRouter;
