import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAvailability {
    day: string;
    startTime: string;
    endTime: string;
}

export interface IBadge {
    id: string;
    name: string;
    icon: string;
    awardedAt: Date;
    description: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'volunteer' | 'admin';
    skills: string[];
    availability: IAvailability[];
    backgroundCheckStatus: 'pending' | 'passed' | 'failed';
    badges: IBadge[];
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { 
        type: String, 
        enum: ['volunteer', 'admin'], 
        default: 'volunteer' 
    },
    skills: { type: [String], default: [] },
    availability: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    backgroundCheckStatus: { 
        type: String, 
        enum: ['pending', 'passed', 'failed'], 
        default: 'pending' 
    },
    badges: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: String, required: true },
        awardedAt: { type: Date, default: Date.now },
        description: String
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password!, salt);
    } catch (err) {
        throw err; 
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password!);
};

export const User = mongoose.model<IUser>('User', userSchema);