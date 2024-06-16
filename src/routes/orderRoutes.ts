import express from "express";

import orderController from "../controllers/orderController";
import isLogin from "../middlewares/authntication";
import authorizationAdmin from "../middlewares/authorization";
const router = express.Router();

router.get("/", isLogin, authorizationAdmin, orderController.getAllOrders);
router.get("/:id", isLogin, orderController.getOrderById);
router.get("/me", isLogin, orderController.getOrderByUserId);
router.post("/checkout", isLogin, orderController.createOrderAndPayment);

export default router;
