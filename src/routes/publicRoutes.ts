import express from 'express';

import publicController from '../controllers/publicController';

const router = express.Router();

router.get('/', publicController.getHello);

export default router;
