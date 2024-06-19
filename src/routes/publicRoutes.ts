import express from 'express';

import destinationController from '../controllers/destinationController';
import transportationController from '../controllers/transportationController';
import accommodationController from '../controllers/accommodationController';
import guideController from '../controllers/guideController';

const router = express.Router();

router.get('/destinations', destinationController.getAllDestinations);
router.get('/destinations/:id', destinationController.getDestinationById);
router.get('/transportations', transportationController.getAllTransportations);
router.get(
  '/transportations/:id',
  transportationController.getTransportationById
);
router.get('/accomodations', accommodationController.getAllAccommodations);
router.get('/accomodations/:id', accommodationController.getAccommodationById);
router.get('/guides', guideController.getAllGuides);
router.get('/guides/:id', guideController.getGuideById);

export default router;
