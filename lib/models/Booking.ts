import mongoose, { Schema, Document } from "mongoose";

export interface IBookingModification {
  previousDate: string;
  previousTime: string;
  newDate: string;
  newTime: string;
  reason: string;
  modifiedAt: Date;
}

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
  trackingId: string;
  modifications: IBookingModification[];
  createdAt: Date;
  updatedAt: Date;
}

const ModificationSchema = new Schema<IBookingModification>({
  previousDate: { type: String, required: true },
  previousTime: { type: String, required: true },
  newDate:      { type: String, required: true },
  newTime:      { type: String, required: true },
  reason:       { type: String, required: true, maxlength: 500 },
  modifiedAt:   { type: Date,   default: Date.now },
});

const BookingSchema = new Schema<IBooking>(
  {
    fullName:      { type: String, required: true, trim: true, maxlength: 100 },
    email:         { type: String, required: true, trim: true, lowercase: true },
    phone:         { type: String, trim: true },
    country:       { type: String, required: true, trim: true },
    service:       { type: String, required: true },
    message:       { type: String, trim: true, maxlength: 2000 },
    date:          { type: String, required: true },
    time:          { type: String, required: true },
    status:        { type: String, enum: ["pending","confirmed","cancelled"], default: "pending" },
    trackingId:    { type: String, required: true, unique: true },
    modifications: [ModificationSchema],
  },
  { timestamps: true }
);

// Index for fast slot lookup
BookingSchema.index({ date: 1, time: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ trackingId: 1 });

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);