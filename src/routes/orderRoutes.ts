import express from 'express';

import orderController from '../controllers/orderController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get(
  '/',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  orderController.getAllOrders
);
router.get('/:id', authMiddleware.authN, orderController.getOrderById);
router.post('/checkout', authMiddleware.authN, orderController.createOrderAndPayment);
router.patch('/:id/status', authMiddleware.authN, orderController.updateOrderStatus);

export default router;
