import express from 'express';

import authController from '../controllers/authController';

const router = express.Router();

router.get('/google', authController.google);
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
