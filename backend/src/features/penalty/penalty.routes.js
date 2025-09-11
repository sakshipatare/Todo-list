import express from "express";
import PenaltyController from "./penalty.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const penaltyRouter = express.Router();
const controller = new PenaltyController();

// User penalties
penaltyRouter.get("/:userId", authMiddleware, controller.getUserPenalties);

// Team penalties
penaltyRouter.get("/team/:teamId", authMiddleware, controller.getTeamPenalties);

// Monthly summary
penaltyRouter.get("/:userId/monthly", authMiddleware, controller.getMonthlySummary);

// Manual trigger for Postman testing
penaltyRouter.post("/run-job", async (req, res) => {
  try {
    await controller.runDailyPenaltyJob();
    res.json({ message: "Penalty job executed successfully" });
  } catch (err) {
    console.error("Manual penalty job error:", err);
    res.status(500).json({ message: "Error running penalty job" });
  }
});

export default penaltyRouter;
