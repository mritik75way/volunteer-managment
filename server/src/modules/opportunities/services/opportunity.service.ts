
import { IOpportunity, Opportunity } from "../models/opportunity.model";
import { CreateOpportunityInput } from "../opportunity.schema";
import { Types } from "mongoose";

export const createOpportunity = async (
  data: CreateOpportunityInput,
  userId: string,
): Promise<IOpportunity> => {
  return await Opportunity.create({
    ...data,
    createdBy: new Types.ObjectId(userId),
  });
};

export const getAllOpportunities = async (user?: any): Promise<any[]> => {
  const opportunities = await Opportunity.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name")
    .lean();

  const now = new Date();
  const bulkUpdates: any[] = [];

  const updatedOpportunities = opportunities.map(opp => {
    let shouldBeClosed = false;

    if (opp.shifts && opp.shifts.length > 0) {
      const allShiftsFull = opp.shifts.every((shift: any) => shift.filled >= shift.capacity);
      const allShiftsExpired = opp.shifts.every((shift: any) => new Date(shift.endTime) < now);
      
      shouldBeClosed = allShiftsFull || allShiftsExpired;
    }

    const updatedStatus = shouldBeClosed ? 'closed' : 'open';

    if (opp.status !== updatedStatus) {
      bulkUpdates.push({
        updateOne: {
          filter: { _id: opp._id },
          update: { status: updatedStatus }
        }
      });
    }

    return {
      ...opp,
      status: updatedStatus
    };
  });

  if (bulkUpdates.length > 0) {
    Opportunity.bulkWrite(bulkUpdates).catch(err => console.error('Bulk update error:', err));
  }

  if (!user || user.role !== 'volunteer') {
    return updatedOpportunities;
  }

  const userSkills = user.skills || [];

  return updatedOpportunities
    .map(opp => {
      const required = opp.requiredSkills || [];
      const matchedSkills = required.filter(skill => userSkills.includes(skill));
      
      return {
        ...opp,
        matchScore: matchedSkills.length,
        isBestMatch: matchedSkills.length > 0 && matchedSkills.length === required.length
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};
