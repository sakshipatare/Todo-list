// penalty.controller.js
import { taskModel } from "../task/task.schema.js";
import { teamModel } from "../team/team.schema.js";
import PenaltyRepo from "./penalty.repository.js";

export default class PenaltyController {
  constructor() {
    this.penaltyRepo = new PenaltyRepo();
  }

  // ✅ Run daily penalty job (called by cron)
  runDailyPenaltyJob = async () => {
    try {
      console.log("🚀 Running daily penalty check...");

      // Get all incomplete tasks up to today
      const incompleteTasks = await taskModel.find({
        isCompleted: false,
        date: { $lte: new Date() },
      });

      let count = 0;

      for (const task of incompleteTasks) {
        const team = await teamModel.findById(task.teamId);
        if (!team) continue;

        try {
          await this.penaltyRepo.create({
            userId: task.userId,
            teamId: task.teamId,
            taskId: task._id,
            penaltyAmount: team.penaltyPerMissedTask || 0,
            date: task.date,
          });
          count++;
        } catch (err) {
          if (err.code === 11000) continue; // duplicate entry
        }
      }

      console.log(`✅ Daily penalty job completed. Total penalties created: ${count}`);
    } catch (err) {
      console.error("❌ Error running daily penalty job:", err);
    }
  };

  // ✅ Get user penalties
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

  // ✅ Get all penalties for a team
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

  // ✅ Monthly summary for a user
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
