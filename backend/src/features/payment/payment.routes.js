import express from "express";
import PaymentController from "./payment.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const paymentRouter = express.Router();
const controller = new PaymentController();

paymentRouter.post("/create", authMiddleware, controller.createPayment);
paymentRouter.post("/webhook", controller.verifyWebhook); // webhook cannot use auth
paymentRouter.get("/:userId", authMiddleware, controller.getUserPayments);

export default paymentRouter;
