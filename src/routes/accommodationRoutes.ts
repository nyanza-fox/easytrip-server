import express from 'express';

import accommodationController from '../controllers/accommodationController';

const router = express.Router();

router.get('/', accommodationController.getAllAccommodations);
router.get('/:id', accommodationController.getAccommodationById);
router.post('/', accommodationController.createAccommodation);
router.put('/:id', accommodationController.updateAccommodation);
router.delete('/:id', accommodationController.deleteAccommodation);

export default router;
