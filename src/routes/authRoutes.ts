import express from 'express';

import authController from '../controllers/authController';

const router = express.Router();

router.get('/', authController.getHello);

export default router;
