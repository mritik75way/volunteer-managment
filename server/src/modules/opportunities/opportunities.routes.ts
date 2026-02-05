import { Router } from 'express';
import * as opportunityController from './opportunities.controller';
import validateRequest from '../../common/middlewares/validateRequest';
import { createOpportunitySchema } from './opportunity.schema';
import { protect, restrictTo } from '../../common/middlewares/authMiddleware';

const router = Router();

router.post(
    '/', 
    protect, 
    restrictTo('admin'), 
    validateRequest(createOpportunitySchema), 
    opportunityController.create
);

router.get('/', protect, opportunityController.getAll);


router.post(
    '/:opportunityId/enroll/:shiftId',
    protect,
    restrictTo('volunteer'),
    opportunityController.enrollInShift
);

router.get('/my-enrollments', protect, opportunityController.getMyEnrollments);

router.get(
    '/:opportunityId/enrollments',
    protect,
    restrictTo('admin'),
    opportunityController.getEnrollmentsForOpportunity
);

router.patch(
    '/enrollments/:enrollmentId/status',
    protect,
    restrictTo('admin'),
    opportunityController.updateStatus
);


router.get('/my-stats', protect, opportunityController.getMyStats);

router.get(
    '/admin-stats', 
    protect, 
    restrictTo('admin'), 
    opportunityController.getAdminStats
);


router.get(
    '/volunteer-history/:volunteerId',
    protect,
    restrictTo('admin'),
    opportunityController.getVolunteerHistory
);


router.get(
    '/enrollments/:enrollmentId/certificate',
    protect,
    opportunityController.downloadCertificate
);


router.post(
    '/:opportunityId/announcements',
    protect,
    restrictTo('admin'),
    opportunityController.postAnnouncement
);

router.get(
    '/:opportunityId/announcements',
    protect,
    opportunityController.getAnnouncements
);

export default router;