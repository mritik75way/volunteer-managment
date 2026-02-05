import { Request, Response } from "express";
import catchAsync from "../../common/utils/catchAsync";
import * as opportunityService from "./services/opportunity.service";
import * as enrollmentService from "./services/enrollment.service";
import * as announcementService from "./services/announcement.service";
import * as statsService from "./services/stats.service";
import * as certificateService from "./certificate.service";

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string };
}

export const create = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const opportunity = await opportunityService.createOpportunity(
      req.body,
      req.user!._id,
    );
    res.status(201).json({
      status: "success",
      message: "Opportunity created successfully",
      data: { opportunity },
    });
  },
);

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const opportunities = await opportunityService.getAllOpportunities(req.user);
  res.status(200).json({
    status: "success",
    data: { opportunities },
  });
});


export const enrollInShift = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const opportunityId = req.params.opportunityId as string;
  const shiftId = req.params.shiftId as string;
  await enrollmentService.enrollVolunteer(opportunityId, shiftId, req.user!._id);
  res.status(200).json({
    status: "success",
    message: "Successfully enrolled in shift",
  });
});

export const getMyEnrollments = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const enrollments = await enrollmentService.getUserEnrollments(req.user!._id);
    res.status(200).json({
      status: "success",
      data: { enrollments },
    });
  },
);

export const getEnrollmentsForOpportunity = catchAsync(
  async (req: Request, res: Response) => {
    const enrollments = await enrollmentService.getOpportunityEnrollments(
      req.params.opportunityId as string,
    );
    res.status(200).json({
      status: "success",
      data: { enrollments },
    });
  },
);

import * as badgeService from "../auth/badge.service";

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const enrollment = await enrollmentService.updateEnrollmentStatus(
    req.params.enrollmentId as string,
    req.body.status,
  );

  let newBadges: any[] = [];
  if (req.body.status === 'completed' && enrollment) {
    const result = await badgeService.checkAndAwardBadges(enrollment.volunteerId.toString());
    if (result && result.newBadges.length > 0) {
      newBadges = result.newBadges;
    }
  }

  res.status(200).json({
    status: "success",
    message: `Volunteer marked as ${req.body.status}`,
    data: { enrollment, newBadges },
  });
});

export const getVolunteerHistory = catchAsync(
  async (req: Request, res: Response) => {
    const history = await enrollmentService.getVolunteerHistory(
      req.params.volunteerId as string,
    );
    res.status(200).json({
      status: "success",
      data: { history },
    });
  },
);


export const getMyStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await statsService.getVolunteerStats(req.user!._id);
  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

export const getAdminStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await statsService.getAdminStats(req.user!._id);
  res.status(200).json({
    status: "success",
    data: { stats },
  });
});


export const postAnnouncement = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const announcement = await announcementService.createAnnouncement(
      req.params.opportunityId as string,
      req.user!._id,
      req.body.message,
    );
    res.status(201).json({
      status: "success",
      data: { announcement },
    });
  },
);

export const getAnnouncements = catchAsync(
  async (req: Request, res: Response) => {
    const announcements = await announcementService.getAnnouncementsByOpportunity(
      req.params.opportunityId as string,
    );
    res.status(200).json({
      status: "success",
      data: { announcements },
    });
  },
);


export const downloadCertificate = catchAsync(
  async (req: Request, res: Response) => {
    const stream = await certificateService.generateCertificateStream(
      req.params.enrollmentId as string,
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate.pdf`,
    );
    stream.pipe(res);
  },
);
