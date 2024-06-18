import express from 'express';

import userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware.authN, authMiddleware.authZ(['admin']), userController.getAllUsers);
router.get('/me', authMiddleware.authN, userController.getMe);
router.get('/me/orders', authMiddleware.authN, userController.getMyOrders);
router.put('/me', authMiddleware.authN, userController.updateMyProfile);

export default router;
