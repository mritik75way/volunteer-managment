import { Enrollment, IEnrollment } from "../models/enrollment.model";
import { Opportunity } from "../models/opportunity.model";


export const getVolunteerStats = async (userId: string) => {
  const completedEnrollments = await Enrollment.find({
    volunteerId: userId,
    status: "completed",
  }).populate({
    path: "opportunityId",
    select: "shifts",
  });

  let totalHours = 0;

  completedEnrollments.forEach((enrollment: IEnrollment) => {
    const opp = enrollment.opportunityId as any;
    if (opp?.shifts) {
      const shift = opp.shifts.id(enrollment.shiftId);
      if (shift) {
        const start = new Date(shift.startTime).getTime();
        const end = new Date(shift.endTime).getTime();
        const durationHours = (end - start) / (1000 * 60 * 60);
        totalHours += durationHours;
      }
    }
  });

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    eventsAttended: completedEnrollments.length,
  };
};

export const getAdminStats = async (userId: string) => {
  const createdCount = await Opportunity.countDocuments({
    createdBy: userId,
  });
  
  const activeCount = await Opportunity.countDocuments({
    createdBy: userId,
    status: "open",
  });

  const completed = await Enrollment.find({ status: "completed" })
    .populate({
      path: "opportunityId",
      select: "shifts",
    })
    .lean();

  let totalHours = 0;

  completed.forEach((en: any) => {
    const shifts = en.opportunityId?.shifts;
    if (shifts) {
      const shift = shifts.find((s: any) => s._id.toString() === en.shiftId.toString());
      if (shift) {
        const start = new Date(shift.startTime).getTime();
        const end = new Date(shift.endTime).getTime();
        const durationHours = (end - start) / (1000 * 60 * 60);
        totalHours += durationHours;
      }
    }
  });

  const uniqueVolunteers = await Enrollment.distinct("volunteerId", {
    status: "completed",
  });

  return {
    createdCount,
    activeCount,
    totalHours: Math.round(totalHours),
    volunteerCount: uniqueVolunteers.length,
  };
};
