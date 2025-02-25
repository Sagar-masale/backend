import { Router } from "express";

import { 
    createOrder,     
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder } from "../controllers/OrdersControllers/order.controller.js";

    const orderRouter = Router();

    orderRouter.route("/add-order").post(createOrder);
    orderRouter.route("/getAll-orders").get(getAllOrders);
    orderRouter.route("/getUser-order").get(getOrderById);
    orderRouter.route("/updateOrder").put(updateOrderStatus);
    orderRouter.route("/deleteOrder").delete(deleteOrder);

    export default orderRouter