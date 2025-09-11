import { taskModel } from "../task/task.schema.js";
import { teamModel } from "../team/team.schema.js";
import PenaltyRepo from "./penalty.repository.js";

export default class PenaltyController {
  constructor() {
    this.penaltyRepo = new PenaltyRepo();
  }

  // Run daily penalty job
  runDailyPenaltyJob = async () => {
  // Get all incomplete tasks up to today
  const incompleteTasks = await taskModel.find({ isCompleted: false, date: { $lte: new Date() } });

  for (const task of incompleteTasks) {
    const team = await teamModel.findById(task.teamId);
    if (!team) continue;

    try {
      await this.penaltyRepo.create({
        userId: task.userId,
        teamId: task.teamId,
        taskId: task._id,
        penaltyAmount: team.penaltyPerMissedTask || 0, // fallback if undefined
        date: task.date,
      });
    } catch (err) {
      if (err.code === 11000) continue; // skip duplicates
    }
  }

  console.log("Daily penalty job completed. Total penalties:", incompleteTasks.length);
};


  // GET /penalties/:userId
  getUserPenalties = async (req, res) => {
    try {
      const { userId } = req.params;
      const penalties = await this.penaltyRepo.findByUser(userId);
      res.json({ userId, penalties });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching penalties" });
    }
  };

  // GET /penalties/team/:teamId
  getTeamPenalties = async (req, res) => {
    try {
      const { teamId } = req.params;
      const penalties = await this.penaltyRepo.findByTeam(teamId);
      res.json({ teamId, penalties });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching team penalties" });
    }
  };

  // GET /penalties/:userId/monthly?month=9&year=2025
  getMonthlySummary = async (req, res) => {
    try {
      const { userId } = req.params;
      const month = parseInt(req.query.month);
      const year = parseInt(req.query.year);

      const summary = await this.penaltyRepo.getMonthlySummary(userId, month, year);
      res.json({ userId, month, year, summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching monthly summary" });
    }
  };
}
