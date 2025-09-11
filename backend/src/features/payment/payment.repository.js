import { paymentModel } from "./payment.schema.js";

export default class PaymentRepo {
  async create(payment) {
    const newPayment = new paymentModel(payment);
    return await newPayment.save();
  }

  async updateStatus(orderId, update) {
    return await paymentModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      update,
      { new: true }
    );
  }

  async findByUser(userId) {
    return await paymentModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByTeam(teamId) {
    return await paymentModel.find({ teamId }).populate("userId", "name email");
  }
}
