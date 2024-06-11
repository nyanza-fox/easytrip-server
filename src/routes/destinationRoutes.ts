import express from 'express';

import destinationController from '../controllers/destinationController';

const router = express.Router();

router.get('/', destinationController.getHello);

export default router;
