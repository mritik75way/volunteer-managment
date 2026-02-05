import { Router } from 'express';
import * as authController from './auth.controller';
import validateRequest from '../../common/middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.schema';
import { protect, restrictTo } from '../../common/middlewares/authMiddleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get(
    '/volunteers', 
    protect, 
    restrictTo('admin'), 
    authController.getAllVolunteers
);
router.get(
    '/export-volunteers',
    protect,
    restrictTo('admin'),
    authController.exportVolunteers
);
router.patch(
    '/volunteers/:volunteerId/background-status',
    protect,
    restrictTo('admin'),
    authController.updateBackgroundStatus
);
router.patch('/update-profile', protect, authController.updateMyProfile);

export default router;