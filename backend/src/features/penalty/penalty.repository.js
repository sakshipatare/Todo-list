import { penaltyModel } from "./penalty.schema.js";

export default class PenaltyRepo {
  async create(penalty) {
    const newPenalty = new penaltyModel(penalty);
    return await newPenalty.save();
  }

  async findByUser(userId) {
    return await penaltyModel.find({ userId }).populate("taskId", "description date");
  }

  async findByTeam(teamId) {
    return await penaltyModel
      .find({ teamId })
      .populate("userId", "name email")
      .populate("taskId", "description date");
  }

  async getMonthlySummary(userId, month, year) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    return await penaltyModel.aggregate([
      { $match: { userId: userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: "$userId", totalPenalty: { $sum: "$penaltyAmount" } } },
    ]);
  }
}
