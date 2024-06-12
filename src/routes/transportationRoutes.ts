import express from 'express';

import transportationController from '../controllers/transportationController';

const router = express.Router();

router.get('/', transportationController.getAllTransportations);
router.get('/:id', transportationController.getTransportationById);
router.post('/', transportationController.createTransportation);
router.put('/:id', transportationController.updateTransportation);
router.delete('/:id', transportationController.deleteTransportation);

export default router;
