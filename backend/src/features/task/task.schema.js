import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    teamId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team", 
        required: true 
    },

    // We’ll normalize this to 00:00:00 UTC for consistent day-based queries
    date: { 
        type: Date, 
        required: true 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
  },
  { timestamps: true }
);

// Helpful indexes for fast lookups
taskSchema.index({ userId: 1, date: 1 });
taskSchema.index({ teamId: 1, date: 1 });
// Optional: prevent exact duplicate descriptions by same user on same date
taskSchema.index(
  { userId: 1, date: 1, description: 1 },
  { unique: true, partialFilterExpression: { description: { $type: "string" } } }
);

export const taskModel = mongoose.models.Task || mongoose.model("Task", taskSchema);
