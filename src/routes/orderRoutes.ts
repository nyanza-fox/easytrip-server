import express from "express";

import orderController from "../controllers/orderController";
import authMiddleware from "../middlewares/authMiddleware";
const router = express.Router();

router.get(
  "/",
  authMiddleware.authN,
  authMiddleware.authZ,
  orderController.getAllOrders
);
router.get("/:id", authMiddleware.authN, orderController.getOrderById);
router.get("/me", authMiddleware.authN, orderController.getOrderByUserId);
router.post("/checkout", orderController.createOrderAndPayment);
router.post("/updateStatus", orderController.updateStatus);

export default router;
