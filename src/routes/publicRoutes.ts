import express from 'express';

import destinationController from '../controllers/destinationController';

const router = express.Router();

router.get('/destinations', destinationController.getAllDestinations);
router.get('/destinations/:id', destinationController.getDestinationById);
router.get('/transportations');
router.get('/transportations/:id');
router.get('/accomodations');
router.get('/accomodations/:id');
router.get('/guides');
router.get('/guides/:id');

export default router;
