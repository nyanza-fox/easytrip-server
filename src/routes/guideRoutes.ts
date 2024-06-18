import express from 'express';

import guideController from '../controllers/guideController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);
router.post(
  '/',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  guideController.createGuide
);
router.put(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  guideController.updateGuide
);
router.delete(
  '/:id',
  authMiddleware.authN,
  authMiddleware.authZ(['admin']),
  guideController.deleteGuide
);

export default router;
