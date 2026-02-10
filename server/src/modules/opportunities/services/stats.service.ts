import { Enrollment, IEnrollment } from "../models/enrollment.model";
import { Opportunity, IShift } from "../models/opportunity.model";
import { Types } from "mongoose";

interface PopulatedEnrollment extends Omit<IEnrollment, 'opportunityId'> {
  opportunityId: {
    shifts: Types.DocumentArray<IShift>;
  };
}


export const getVolunteerStats = async (userId: string) => {
  const completedEnrollments = await Enrollment.find({
    volunteerId: userId,
    status: "completed",
  }).populate({
    path: "opportunityId",
    select: "shifts",
  });

  let totalHours = 0;

  completedEnrollments.forEach((enrollment) => {
    const opp = enrollment.opportunityId as unknown as PopulatedEnrollment['opportunityId'];
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

  completed.forEach((en) => {
    const typedEn = en as unknown as PopulatedEnrollment;
    const shifts = typedEn.opportunityId?.shifts;
    if (shifts) {
      const shift = shifts.find((s: IShift) => s._id.toString() === typedEn.shiftId.toString());
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
