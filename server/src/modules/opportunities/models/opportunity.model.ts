import mongoose, { Schema, Document } from "mongoose";

export interface IShift extends Document {
  startTime: Date;
  endTime: Date;
  capacity: number;
  filled: number;
}

export interface IOpportunity extends Document {
  title: string;
  description: string;
  location: string;
  requirements: string[];
  requiredSkills: string[];
  shifts: mongoose.Types.DocumentArray<IShift>;
  status: "open" | "closed";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const shiftSchema = new Schema<IShift>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
  filled: { type: Number, default: 0 },
});

const opportunitySchema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    requirements: [String],
    requiredSkills: { type: [String], default: [] },
    shifts: [shiftSchema],
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Opportunity = mongoose.model<IOpportunity>(
  "Opportunity",
  opportunitySchema,
);
