import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
    opportunityId: Types.ObjectId;
    shiftId: Types.ObjectId;
    volunteerId: Types.ObjectId;
    status: 'enrolled' | 'cancelled' | 'completed';
    createdAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>({
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    shiftId: { type: Schema.Types.ObjectId, required: true },
    volunteerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['enrolled', 'cancelled', 'completed'], 
        default: 'enrolled' 
    }
}, {
    timestamps: true
});

enrollmentSchema.index({ shiftId: 1, volunteerId: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
