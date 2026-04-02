import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  name: string;
  country: string;
  service: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name:     { type: String, required: true, trim: true, maxlength: 80 },
    country:  { type: String, required: true, trim: true },
    service:  { type: String, required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    message:  { type: String, required: true, trim: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);