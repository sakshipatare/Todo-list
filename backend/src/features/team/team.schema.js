import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({

  teamName: { 
    type: String, 
    required: true 
},
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
}],
  penaltyPerMissedTask: { 
    type: Number, 
    default: 10 } // set default penalty
});

export const teamModel = mongoose.model("Team", teamSchema);
