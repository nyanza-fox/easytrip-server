import express from 'express';

import destinationController from '../controllers/destinationController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post(
  '/',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  destinationController.createDestination
);
router.post('/generate', authMiddleware.authN, destinationController.generateDestinationsByPrompt);
router.post(
  '/:id/packages',
  authMiddleware.authN,
  destinationController.generateDestinationPackages
);
router.post(
  '/:id/itinerary',
  authMiddleware.authN,
  destinationController.generateDestinationItinerary
);
router.put(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  destinationController.updateDestination
);
router.delete(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  destinationController.deleteDestination
);

export default router;
