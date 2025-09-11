import Razorpay from "razorpay";
import crypto from "crypto";
import PaymentRepo from "./payment.repository.js";

export default class PaymentController {
  constructor() {
    this.paymentRepo = new PaymentRepo();

    this.createPayment = this.createPayment.bind(this);
    this.verifyWebhook = this.verifyWebhook.bind(this);
    this.getUserPayments = this.getUserPayments.bind(this);
  }

  // ✅ POST /payments/create
  async createPayment(req, res) {
    try {
      const { userId, teamId, amount } = req.body;

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // Razorpay works in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      await this.paymentRepo.create({
        userId,
        teamId,
        amount,
        razorpayOrderId: order.id,
        status: "created",
      });

      res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
      console.error("Payment creation error:", err);
      res.status(500).json({ message: "Error creating payment" });
    }
  }

  // ✅ POST /payments/webhook
  async verifyWebhook(req, res) {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      const signature = req.headers["x-razorpay-signature"];
      const body = JSON.stringify(req.body);

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const event = req.body.event;
      const payload = req.body.payload.payment.entity;

      let status = "failed";
      if (event === "payment.captured") {
        status = "paid";
      }

      await this.paymentRepo.updateStatus(payload.order_id, {
        razorpayPaymentId: payload.id,
        razorpaySignature: signature,
        status,
      });

      res.json({ message: "Webhook verified", status });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  }

  // ✅ GET /payments/:userId
  async getUserPayments(req, res) {
    try {
      const { userId } = req.params;
      const payments = await this.paymentRepo.findByUser(userId);
      res.json({ userId, payments });
    } catch (err) {
      console.error("Get payments error:", err);
      res.status(500).json({ message: "Error fetching payments" });
    }
  }
}
