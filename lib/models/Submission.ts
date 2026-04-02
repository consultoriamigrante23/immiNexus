import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  service: string;
  message?: string;
  type: "contact" | "booking";
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, trim: true },
    country:  { type: String, required: true, trim: true },
    service:  { type: String, required: true },
    message:  { type: String, trim: true, maxlength: 2000 },
    type:     { type: String, enum: ["contact","booking"], required: true },
  },
  { timestamps: true }
);

// Index for spam cooldown check
SubmissionSchema.index({ email: 1, createdAt: -1 });

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);