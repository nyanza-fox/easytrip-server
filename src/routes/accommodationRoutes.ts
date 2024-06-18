import express from 'express';

import accommodationController from '../controllers/accommodationController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', accommodationController.getAllAccommodations);
router.get('/:id', accommodationController.getAccommodationById);
router.post(
  '/',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  accommodationController.createAccommodation
);
router.put(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  accommodationController.updateAccommodation
);
router.delete(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  accommodationController.deleteAccommodation
);

export default router;
