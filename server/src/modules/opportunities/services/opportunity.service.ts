
import { IOpportunity, Opportunity, IShift } from "../models/opportunity.model";
import { CreateOpportunityInput } from "../opportunity.schema";
import { Types, UpdateWriteOpResult } from "mongoose";
import { IUser } from "../../auth/user.model";

interface OpportunityWithMatch {
  _id: Types.ObjectId;
  title: string;
  description: string;
  location: string;
  requirements: string[];
  requiredSkills: string[];
  shifts: IShift[];
  status: "open" | "closed";
  createdBy: { name: string };
  createdAt: Date;
  updatedAt: Date;
  matchScore?: number;
  isBestMatch?: boolean;
}

export const createOpportunity = async (
  data: CreateOpportunityInput,
  userId: string,
): Promise<IOpportunity> => {
  return await Opportunity.create({
    ...data,
    createdBy: new Types.ObjectId(userId),
  });
};

export const getAllOpportunities = async (user?: IUser): Promise<OpportunityWithMatch[]> => {
  const opportunities = await Opportunity.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name")
    .lean();

  const now = new Date();
  const bulkUpdates: Parameters<typeof Opportunity.bulkWrite>[0] = [];

  const updatedOpportunities = opportunities.map(opp => {
    let shouldBeClosed = false;

    if (opp.shifts && opp.shifts.length > 0) {
      const allShiftsFull = opp.shifts.every((shift: IShift) => shift.filled >= shift.capacity);
      const allShiftsExpired = opp.shifts.every((shift: IShift) => new Date(shift.endTime) < now);
      
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
    return updatedOpportunities as unknown as OpportunityWithMatch[];
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
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)) as unknown as OpportunityWithMatch[];
};
