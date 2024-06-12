import express from 'express';

import guideController from '../controllers/guideController';

const router = express.Router();

router.get('/', guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);
router.post('/', guideController.createGuide);
router.put('/:id', guideController.updateGuide);
router.delete('/:id', guideController.deleteGuide);

export default router;
