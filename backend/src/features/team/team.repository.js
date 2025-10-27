import { teamModel } from "./team.schema.js";

export default class TeamRepo {
  async createTeam(team) {
    const newTeam = new teamModel(team);
    return await newTeam.save();
  }

  // async findTeamById(id) {
  //   return await teamModel.findById(id).populate("members");
  // }

  async findByUserId(userId) {
    return await teamModel
      .findOne({ members: userId }) // match if user is part of team
      .populate("members")          // show member details
      .populate("admin");           // show admin details
  }

  async addMember(teamId, userId) {
    return await teamModel.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: userId } }, // avoid duplicates
      { new: true }
    ).populate("members");
  }
}
