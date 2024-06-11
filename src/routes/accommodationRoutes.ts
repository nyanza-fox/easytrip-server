import express from 'express';

import accommodationController from '../controllers/accommodationController';

const router = express.Router();

router.get('/', accommodationController.getHello);

export default router;
