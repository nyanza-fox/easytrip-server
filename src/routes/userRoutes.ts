import express from 'express';

import userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/me', authMiddleware.authN, userController.getMe);
router.put('/me', authMiddleware.authN, userController.updateMyProfile);

export default router;
