import express from 'express';

import transportationController from '../controllers/transportationController';

const router = express.Router();

router.get('/', transportationController.getHello);

export default router;
