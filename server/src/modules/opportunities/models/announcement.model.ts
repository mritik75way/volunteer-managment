import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    opportunityId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);
