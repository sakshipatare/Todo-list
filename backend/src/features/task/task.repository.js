import { taskModel } from "./task.schema.js";

export default class TaskRepo {
  async createTask(payload) {
    const task = new taskModel(payload);
    return await task.save();
  }

  async getTasksByUserAndDate(userId, date) {
    return await taskModel.find({ userId, date }).sort({ createdAt: 1 });
  }

  async getTasksByTeamAndDate(teamId, date) {
    return await taskModel
      .find({ teamId, date })
      .populate("userId", "name email")
      .sort({ createdAt: 1 });
  }

  async getTasksByTeamAndRange(teamId, fromDate, toDate) {
    return await taskModel
      .find({ teamId, date: { $gte: fromDate, $lte: toDate } })
      .populate("userId", "name email")
      .sort({ date: 1, createdAt: 1 });
  }

  async findById(id) {
    return await taskModel.findById(id);
  }

  async updateTask(id, updates) {
    return await taskModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteTask(id) {
    return await taskModel.findByIdAndDelete(id);
  }

  async findByTeam(teamId) {
  try {
    return await taskModel.find({ teamId })
      .populate("userId", "name email") // show who owns the task
      .sort({ date: 1 }); // order by date
  } catch (err) {
    console.error("findByTeam error:", err);
    throw err;
  }
}

}
