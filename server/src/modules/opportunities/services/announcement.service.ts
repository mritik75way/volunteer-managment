import { Announcement } from "../models/announcement.model";

export const createAnnouncement = async (
  opportunityId: string,
  adminId: string,
  message: string,
) => {
  return await Announcement.create({
    opportunityId,
    adminId,
    message,
  });
};

export const getAnnouncementsByOpportunity = async (opportunityId: string) => {
  return await Announcement.find({ opportunityId })
    .sort({ createdAt: -1 })
    .populate("adminId", "name");
};
