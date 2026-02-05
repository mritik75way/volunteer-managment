import { User, IUser } from './user.model';
import { RegisterInput, LoginInput } from './auth.schema';
import AppError from '../../common/utils/AppError';
import { Enrollment } from '../../modules/opportunities/models/enrollment.model';

export const createUser = async (input: RegisterInput): Promise<IUser> => {
    return await User.create(input);
};

export const updateProfile = async (userId: string, data: { skills?: string[], availability?: string[] }) => {
    return await User.findByIdAndUpdate(
        userId,
        { $set: data },
        { new: true, runValidators: true }
    ).select('-password');
};

export const loginUser = async (input: LoginInput): Promise<IUser> => {
    const { email, password } = input;
    
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }

    return user;
};

export const findUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};
export const getVolunteersForExport = async () => {
    const volunteers = await User.find({ role: 'volunteer' }).select('name email createdAt');
    
    const reportData = await Promise.all(volunteers.map(async (v) => {
        const enrollments = await Enrollment.find({ volunteerId: v._id, status: 'completed' });
        return {
            Name: v.name,
            Email: v.email,
            Joined: v.createdAt.toISOString().split('T')[0],
            EventsAttended: enrollments.length
        };
    }));

    return reportData;
};

export const updateVolunteerStatus = async (volunteerId: string, status: 'pending' | 'passed' | 'failed') => {
    return await User.findByIdAndUpdate(
        volunteerId,
        { backgroundCheckStatus: status },
        { new: true }
    ).select('name email backgroundCheckStatus');
};