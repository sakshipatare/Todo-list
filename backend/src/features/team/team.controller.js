import TeamRepo from "./team.repository.js";

export default class TeamController {
  constructor() {
    this.teamRepo = new TeamRepo();
  }

  async createTeam(req, res) {
    try {
      const { teamName, penaltyPerMissedTask } = req.body;
      const adminId = req.user.id; // from JWT
      const team = await this.teamRepo.createTeam({
        teamName,
        admin: adminId,
        members: [adminId],
        penaltyPerMissedTask,
      });
      res.status(201).json({ message: "Team created", team });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating team" });
    }
  }

  async joinTeam(req, res) {
    try {
      const { teamId } = req.body;
      const userId = req.user.id;
      const team = await this.teamRepo.addMember(teamId, userId);
      res.status(200).json({ message: "Joined team successfully", team });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error joining team" });
    }
  }
}
