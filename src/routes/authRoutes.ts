import express from 'express';

import authController from '../controllers/authController';

const router = express.Router();

router.get('/google', authController.google);
router.get('/facebook', authController.facebook);
router.get('/facebook/callback', authController.facebookCallback);
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
