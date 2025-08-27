import mongoose, { Document, Schema } from "mongoose";


export interface Interview extends Document {
  id: string;
  candidateId: string;
  scheduledAt: Date;
  type:string;
  status: "scheduled" | "completed" | "canceled"; 
  score?: number;
  interviewerName: string;
}

const interviewSchema: Schema<Interview> = new Schema(
  {
    candidateId: { 
      type: String, 
      required: [true, "CandidateId is required"], 
      index: true  
    },
    scheduledAt: { 
      type: Date, 
      required: [true, "Scheduled date and time is required"] 
    },
    status: { 
      type: String, 
      enum: ["scheduled", "completed", "canceled"], 
      default: "scheduled", 
      required: true
    },
    score: { 
      type: Number, 
      min: 0, 
      max: 100,
      default: 0 
    },
    interviewerName: { 
      type: String, 
      required: [true, "Interviewer name is required"], 
      trim: true 
    }
  },
  { timestamps: true }
);


const InterviewModel = (mongoose.models.Interview as mongoose.Model<Interview>) ||
  mongoose.model<Interview>("Interview", interviewSchema);

export default InterviewModel;
