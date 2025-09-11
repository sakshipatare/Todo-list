import express from "express";
import TaskController from "./task.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const taskRouter = express.Router();
const controller = new TaskController();

// Create a task (user-owned, in a team, for a date)
taskRouter.post("/", authMiddleware, controller.createTask);

// My tasks for a date
taskRouter.get("/my", authMiddleware, controller.getMyTasksByDate);

// Team tasks for a date
taskRouter.get("/team/:teamId", authMiddleware, controller.getTeamTasksByDate);

// Team tasks for a date range
taskRouter.get("/team/:teamId/range", authMiddleware, controller.getTeamTasksByRange);

// Mark complete / uncomplete
taskRouter.patch("/:id/complete", authMiddleware, controller.toggleComplete);

// Update description/date
taskRouter.patch("/:id", authMiddleware, controller.updateTask);

// Delete
taskRouter.delete("/:id", authMiddleware, controller.deleteTask); 

// taskRouter.get("/team/:teamId", authMiddleware, (req, res) => {
//   TaskController.getTeamTasks(req, res);
// });

taskRouter.get("/team/:teamId", authMiddleware, controller.getTeamTasks);

export default taskRouter;
