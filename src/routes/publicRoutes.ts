import express from 'express';

import destinationController from '../controllers/destinationController';

const router = express.Router();

router.get('/destinations', destinationController.getHello);

export default router;
