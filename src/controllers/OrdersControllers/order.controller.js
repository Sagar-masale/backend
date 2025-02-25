import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Order } from "../../models/Orders/order.model.js";
import { User } from "../../models/user.model.js";

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
    const { userId, totalAmount, orderQuantity, productId } = req.body;

    const newOrder = await Order.create({ userId, totalAmount, orderQuantity, productId });

    // ✅ Ensure order is added to user's order list
    await User.findByIdAndUpdate(userId, { $push: { userOrders: newOrder._id } });

    return res.status(201).json(new apiResponse(201, newOrder, "Order created successfully"));
});


// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("userId", "fullName email");

    return res.status(200).json(
        new apiResponse(200, orders, "Orders retrieved successfully")
    );
});

// Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("userId", "fullName email");

    if (!order) {
        throw new apiError(404, "Order not found");
    }

    return res.status(200).json(
        new apiResponse(200, order, "Order retrieved successfully")
    );
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    
    const { orderStatus, orderId } = req.body;

    if (!["pending", "Success", "Cancle"].includes(orderStatus)) {
        throw new apiError(400, "Invalid order status");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
    );

    if (!updatedOrder) {
        throw new apiError(404, "Order not found");
    }

    return res.status(200).json(
        new apiResponse(200, updatedOrder, "Order status updated successfully")
    );
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
        throw new apiError(404, "Order not found");
    }

    return res.status(200).json(
        new apiResponse(200, {}, "Order deleted successfully")
    );
});

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};


