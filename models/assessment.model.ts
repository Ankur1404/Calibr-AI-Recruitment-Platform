import mongoose, { Document, Schema } from "mongoose";

export interface Assessment extends Document {
  id: string;
  candidateId: string;
  type: string;   
  score: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema: Schema<Assessment> = new Schema(
  {
    candidateId: { 
      type: String, 
      required: [true, "CandidateId is required"], 
      index: true  
    },
    type: { 
      type: String, 
      required: [true, "Assessment type is required"], 
      // enum: ["technical", "softskills", "industry"] 
    },
    score: { 
      type: Number, 
      required: [true, "Score is required"], 
      min: [0, "Score cannot be less than 0"], 
      max: [100, "Score cannot be more than 100"] 
    },
    completedAt: { 
      type: Date, 
      default: null 
    }
  },
  { timestamps: true }
);


assessmentSchema.index({ candidateId: 1, completedAt: 1 });
assessmentSchema.index({ candidateId: 1, type: 1 });


const AssessmentModel =(mongoose.models.Assessment as mongoose.Model<Assessment>) ||
  mongoose.model<Assessment>("Assessment", assessmentSchema);

export default AssessmentModel;
