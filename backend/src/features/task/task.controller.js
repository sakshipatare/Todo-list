import TaskRepo from "./task.repository.js";
import { teamModel } from "../team/team.schema.js";

const toStartOfDayUTC = (input) => {
  const d = input ? new Date(input) : new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

export default class TaskController {
  constructor() {
    this.taskRepo = new TaskRepo();
  }

  // Ensure the requesting user is a member of the team
  assertTeamMember = async (teamId, userId) => {
    const team = await teamModel.findById(teamId);
    if (!team) return { ok: false, code: 404, msg: "Team not found" };

    const isMember = team.members.some((m) => m.toString() === userId.toString());
    if (!isMember) return { ok: false, code: 403, msg: "Not a member of this team" };

    return { ok: true, team };
  };

  // POST /tasks
  createTask = async (req, res) => {
    try {
      const { teamId, date, description } = req.body;

      const team = await teamModel.findById(teamId);
      if (!team) return res.status(404).json({ message: "Team not found" });

      if (!team.members.includes(req.user._id)) {
        return res.status(403).json({ message: "You are not part of this team" });
      }

      const task = await this.taskRepo.createTask({
        userId: req.user._id,
        teamId,
        date,
        description,
      });

      res.status(201).json({ message: "Task created", task });
    } catch (err) {
      console.error("createTask error:", err);
      res.status(500).json({ message: "Error creating task" });
    }
  };

  // GET /tasks/my?date=YYYY-MM-DD
  // getMyTasksByDate = async (req, res) => {
  //   try {
  //     const normalizedDate = toStartOfDayUTC(req.query.date);
  //     const tasks = await this.taskRepo.getTasksByUserAndDate(req.user._id, normalizedDate);
  //     res.status(200).json({ tasks });
  //   } catch (err) {
  //     console.error("getMyTasksByDate error:", err);
  //     res.status(500).json({ message: "Error fetching tasks" });
  //   }
  // };

  // task.controller.js
// Replace your current getMyTasksByDate
    getMyTasksByDate = async (req, res) => {
      try {
        const userId = req.user._id;
        const tasks = await this.taskRepo.getTasksByUser(userId);
        res.status(200).json(tasks);
      } catch (err) {
        console.error("getMyTasksByDate error:", err);
        res.status(500).json({ message: "Error fetching tasks" });
      }
    };




  // GET /tasks/team/:teamId?date=YYYY-MM-DD
  getTeamTasksByDate = async (req, res) => {
    try {
      const { teamId } = req.params;
      const normalizedDate = toStartOfDayUTC(req.query.date);

      const membership = await this.assertTeamMember(teamId, req.user._id);
      if (!membership.ok) return res.status(membership.code).json({ message: membership.msg });

      const tasks = await this.taskRepo.getTasksByTeamAndDate(teamId, normalizedDate);
      res.status(200).json({ tasks });
    } catch (err) {
      console.error("getTeamTasksByDate error:", err);
      res.status(500).json({ message: "Error fetching team tasks" });
    }
  };

  // GET /tasks/team/:teamId/range?from=YYYY-MM-DD&to=YYYY-MM-DD
  getTeamTasksByRange = async (req, res) => {
    try {
      const { teamId } = req.params;
      const from = toStartOfDayUTC(req.query.from);
      const to = toStartOfDayUTC(req.query.to);

      const membership = await this.assertTeamMember(teamId, req.user._id);
      if (!membership.ok) return res.status(membership.code).json({ message: membership.msg });

      const tasks = await this.taskRepo.getTasksByTeamAndRange(teamId, from, to);
      res.status(200).json({ tasks });
    } catch (err) {
      console.error("getTeamTasksByRange error:", err);
      res.status(500).json({ message: "Error fetching tasks" });
    }
  };

  // PATCH /tasks/:id/complete
  toggleComplete = async (req, res) => {
    try {
      const { id } = req.params;
      const { isCompleted } = req.body;

      const task = await this.taskRepo.findById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      const team = await teamModel.findById(task.teamId);

      if (!task.userId.equals(req.user._id) && !team.admin.equals(req.user._id)) {
        return res.status(403).json({ message: "Not authorized to update this task" });
      }

      task.isCompleted = isCompleted;
      await task.save();

      res.json({ message: "Task updated", task });
    } catch (err) {
      console.error("toggleComplete error:", err);
      res.status(500).json({ message: "Error updating task" });
    }
  };

  // PATCH /tasks/:id
  updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { description, date } = req.body;

      const task = await this.taskRepo.findById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const updates = {};
      if (description) updates.description = description.trim();
      if (date) updates.date = toStartOfDayUTC(date);

      const updated = await this.taskRepo.updateTask(id, updates);
      res.status(200).json({ message: "Task updated", task: updated });
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ message: "Duplicate task for this day" });
      }
      console.error("updateTask error:", err);
      res.status(500).json({ message: "Error updating task" });
    }
  };

  // DELETE /tasks/:id
  deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
      const task = await this.taskRepo.findById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
      }

      await this.taskRepo.deleteTask(id);
      res.status(200).json({ message: "Task deleted" });
    } catch (err) {
      console.error("deleteTask error:", err);
      res.status(500).json({ message: "Error deleting task" });
    }
  };

  // GET /tasks/team/:teamId/all
  getTeamTasks = async (req, res) => {
    try {
      const { teamId } = req.params;

      const team = await teamModel.findById(teamId);
      if (!team) return res.status(404).json({ message: "Team not found" });

      if (!team.members.includes(req.user._id)) {
        return res.status(403).json({ message: "You are not part of this team" });
      }

      const tasks = await this.taskRepo.findByTeam(teamId);
      res.json({ teamId, tasks });
    } catch (err) {
      console.error("getTeamTasks error:", err);
      res.status(500).json({ message: "Error fetching team tasks" });
    }
  };
}
