import express from 'express';

import destinationController from '../controllers/destinationController';

const router = express.Router();

router.get('/destinations', destinationController.getAllDestinations);
router.get('/destinations/:id', destinationController.getDestinationById);

export default router;
