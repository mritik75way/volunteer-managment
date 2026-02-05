import { User } from './user.model';
import { Enrollment } from '../opportunities/models/enrollment.model';
import { Opportunity } from '../opportunities/models/opportunity.model';

export const BADGES = {
    BRONZE: {
        id: 'bronze_hours',
        name: 'Community Starter',
        icon: '🥉',
        threshold: 10,
        description: 'Completed 10 hours of volunteer service'
    },
    SILVER: {
        id: 'silver_hours',
        name: 'Dedicated Helper',
        icon: '🥈',
        threshold: 50,
        description: 'Completed 50 hours of volunteer service'
    },
    GOLD: {
        id: 'gold_hours',
        name: 'Impact Leader',
        icon: '🥇',
        threshold: 100,
        description: 'Completed 100 hours of volunteer service'
    }
};

export const checkAndAwardBadges = async (userId: string) => {
    const completedEnrollments = await Enrollment.find({
        volunteerId: userId,
        status: 'completed'
    });

    let totalHours = 0;

    for (const enrollment of completedEnrollments) {
        const opportunity = await Opportunity.findById(enrollment.opportunityId);
        if (opportunity) {
            const shift = opportunity.shifts.id(enrollment.shiftId);
            if (shift) {
                const duration = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
                totalHours += duration;
            }
        }
    }

    const user = await User.findById(userId);
    if (!user) return;

    const currentBadges = new Set(user.badges.map(b => b.id));
    const newBadges = [];

    if (totalHours >= BADGES.BRONZE.threshold && !currentBadges.has(BADGES.BRONZE.id)) {
        newBadges.push(BADGES.BRONZE);
    }
    if (totalHours >= BADGES.SILVER.threshold && !currentBadges.has(BADGES.SILVER.id)) {
        newBadges.push(BADGES.SILVER);
    }
    if (totalHours >= BADGES.GOLD.threshold && !currentBadges.has(BADGES.GOLD.id)) {
        newBadges.push(BADGES.GOLD);
    }

    if (newBadges.length > 0) {
        user.badges.push(...newBadges.map(b => ({
            id: b.id,
            name: b.name,
            icon: b.icon,
            description: b.description,
            awardedAt: new Date()
        })));
        await user.save();
    }

    return { totalHours, newBadges };
};
