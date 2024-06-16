import express from 'express';

import destinationController from '../controllers/destinationController';

const router = express.Router();

router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post('/', destinationController.createDestination);
router.post('/generate', destinationController.generateDestinationsByPrompt);
router.post('/:id/packages', destinationController.generateDestinationPackages);
router.post('/:id/itinerary', destinationController.generateDestinationItinerary);
router.put('/:id', destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

export default router;
