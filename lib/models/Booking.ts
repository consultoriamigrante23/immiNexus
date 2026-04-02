import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  service: string;
  message?: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    fullName:  { type: String, required: true, trim: true, maxlength: 100 },
    email:     { type: String, required: true, trim: true, lowercase: true },
    phone:     { type: String, trim: true },
    country:   { type: String, required: true, trim: true },
    service:   { type: String, required: true },
    message:   { type: String, trim: true, maxlength: 2000 },
    date:      { type: String, required: true },
    time:      { type: String, required: true },
    status:    { type: String, enum: ["pending","confirmed","cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);