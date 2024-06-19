import express from 'express';

import transportationController from '../controllers/transportationController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', transportationController.getAllTransportations);
router.get('/:id', transportationController.getTransportationById);
router.post(
  '/',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  transportationController.createTransportation
);
router.put(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  transportationController.updateTransportation
);
router.delete(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  transportationController.deleteTransportation
);

export default router;
