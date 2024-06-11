import express from 'express';

import guideController from '../controllers/guideController';

const router = express.Router();

router.get('/', guideController.getHello);

export default router;
