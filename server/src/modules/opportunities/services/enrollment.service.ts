import AppError from "../../../common/utils/AppError";
import { Enrollment, IEnrollment } from "../models/enrollment.model";
import { Opportunity } from "../models/opportunity.model";


import { User } from "../../auth/user.model";

export const enrollVolunteer = async (
  opportunityId: string,
  shiftId: string,
  volunteerId: string,
) => {
  const user = await User.findById(volunteerId);
  if (!user) {
     throw new AppError("User not found", 404);
  }

  if (user.backgroundCheckStatus !== 'passed') {
     throw new AppError("Background check must be passed to join shifts", 403);
  }

  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    throw new AppError("Opportunity not found", 404);
  }

  const shift = opportunity.shifts.id(shiftId);
  if (!shift) {
    throw new AppError("Shift not found", 404);
  }

  if (shift.filled >= shift.capacity) {
    throw new AppError("Shift is full", 400);
  }

  const existingEnrollment = await Enrollment.findOne({
    shiftId,
    volunteerId,
  });

  if (existingEnrollment) {
    throw new AppError("You are already enrolled in this shift", 400);
  }

  await Enrollment.create({
    opportunityId,
    shiftId,
    volunteerId,
  });

  shift.filled += 1;
  await opportunity.save();

  return { opportunity, shift };
};

export const getUserEnrollments = async (userId: string) => {
  const enrollments = await Enrollment.find({ volunteerId: userId })
    .populate({
      path: "opportunityId",
      select: "title location shifts",
    })
    .sort({ createdAt: -1 });

  return enrollments.map((enrollment: IEnrollment) => {
    const opp = enrollment.opportunityId as any;
    const shift = opp?.shifts ? opp.shifts.id(enrollment.shiftId) : null;

    return {
      ...enrollment.toObject(),
      shiftDetails: shift
        ? {
            startTime: shift.startTime,
            endTime: shift.endTime,
            capacity: shift.capacity,
          }
        : null,
    };
  });
};

export const getOpportunityEnrollments = async (opportunityId: string) => {
  return await Enrollment.find({ opportunityId })
    .populate("volunteerId", "name email")
    .sort({ createdAt: -1 });
};

export const updateEnrollmentStatus = async (
  enrollmentId: string,
  status: "enrolled" | "cancelled" | "completed",
) => {
  return await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { status },
    { new: true },
  );
};

export const getVolunteerHistory = async (volunteerId: string) => {
  return await Enrollment.find({ volunteerId })
    .populate({
      path: "opportunityId",
      select: "title location shifts",
    })
    .sort({ createdAt: -1 });
};
