import mongoose from "mongoose";

const penaltySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    penaltyAmount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

penaltySchema.index({ userId: 1, teamId: 1, taskId: 1 }, { unique: true });

export const penaltyModel = mongoose.models.Penalty || mongoose.model("Penalty", penaltySchema);
