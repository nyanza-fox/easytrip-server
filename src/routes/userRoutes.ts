import express from "express";
import userController from "../controllers/userController";
import isLogin from "../middlewares/authntication";
const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/me", isLogin, userController.getProfile);
router.patch("/me", isLogin, userController.updateProfile);
export default router;
