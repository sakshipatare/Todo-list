import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import userRouter from "./src/features/user/user.routes.js";
import teamRouter from "./src/features/team/team.routes.js";
import taskRouter from "./src/features/task/task.routes.js";
import penaltyRouter from "./src/features/penalty/penalty.routes.js";
import paymentRouter from "./src/features/payment/payment.routes.js";

import cors from "cors";
import cron from "node-cron";
import PenaltyController from "./src/features/penalty/penalty.controller.js";

const server = express();

// ✅ Add CORS
server.use(
  cors({
    origin: "*", // allow all (change later to frontend domain)
    credentials: true,
  })
);

server.use(express.json());

// ✅ Routes
server.use("/users", userRouter);
server.use("/teams", teamRouter);
server.use("/tasks", taskRouter);
server.use("/penalties", penaltyRouter);
server.use("/payments", paymentRouter);

// ✅ Cron job setup
const penaltyController = new PenaltyController();
cron.schedule("59 23 * * *", async () => {
  console.log("⚡ Running daily penalty job...");
  await penaltyController.runDailyPenaltyJob();
});

server.listen(4000, () => {
  console.log("✅ Server is running at 4000");
  connectUsingMongoose();
});
