import express from 'express';

import eventController from '../controllers/eventController';

const router = express.Router();

router.get('/', eventController.getHello);

export default router;
