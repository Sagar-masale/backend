import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Order } from "../../models/Orders/order.model.js";
import { User } from "../../models/user.model.js";
import { BangleData } from "../../models/bangleData.model.js";
import { ChainData } from "../../models/chainData.model.js";
import { EarringData } from "../../models/earringData.model.js";
import { MangalsutraData } from "../../models/mangalsutraData.model.js";
import { PendantData } from "../../models/pendantData.model.js";
import { RingData } from "../../models/ringData.model.js";
import { disconnect } from "mongoose";
import { sendOrderConfirmationEmail } from "../../Auth/sendOrderConfirmationEmail.js";
import { sendOrderCancellationEmail } from "../../Auth/sendOrderCancellationEmail.js";

// Utility function to find product by ID in different collections
const findProductById = async (productId) => {
    return await BangleData.findById(productId) ||
           await ChainData.findById(productId) ||
           await EarringData.findById(productId) ||
           await MangalsutraData.findById(productId) ||
           await PendantData.findById(productId) ||
           await RingData.findById(productId);
};

// ✅ Create a new order
const createOrder = asyncHandler(async (req, res) => {
    const { userId, totalAmount, orderQuantity, products, discount, totalAmountWithDiscount, } = req.body; // products is an array

    // Fetch product details
    const productDetails = await Promise.all(
        products.map(async (product) => {
            return await findProductById(product.productId);
        })
    );

    if (productDetails.includes(null)) {
        throw new apiError(404, "One or more products not found");
    }

    // Create order
    const newOrder = await Order.create({
        userId,
        totalAmount,
        orderQuantity,
        products,
        discount,
        totalAmountWithDiscount,
        orderDetails: productDetails,
    });

    console.log("Order:", newOrder);
    
    // Add order to user's order list
    await User.findByIdAndUpdate(userId, { $push: { userOrders: newOrder._id } });
      const user = await User.findById(userId);
        if (user?.email) {
            await sendOrderConfirmationEmail(user.email, newOrder); // ✅ Send email
        }

    return res.status(201).json(new apiResponse(201, newOrder, "Order created successfully"));
});

// ✅ Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("userId", "-password -refreshToken -accessToken");

    // Fetch product details for each order
    const updatedOrders = await Promise.all(
        orders.map(async (order) => {
            const productDetails = await Promise.all(
                order.products.map(async (product) => {
                    return await findProductById(product.productId);
                })
            );

            return { ...order.toObject(), productDetails };
        })
    );

    return res.status(200).json(new apiResponse(200, updatedOrders, "Orders retrieved successfully"));
});

// ✅ Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const { orderIds } = req.body; // Expecting an array



    // Fetch multiple orders using `find`
    const orders = await Order.find({ _id: { $in: orderIds } })
        .populate("userId", "-password -refreshToken -accessToken -userOrders");

    if (!orders || orders.length === 0) {
        throw new apiError(404, "Orders not found");
    }

    // Fetch product details for all orders
    const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
            const productDetails = await Promise.all(
                order.products.map(async (product) => await findProductById(product.productId))
            );
            return { ...order.toObject(), orderDetails: productDetails };
        })
    );

    return res.status(200).json(new apiResponse(200, ordersWithDetails, "Orders retrieved successfully"));
});

// ✅ Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus, orderId } = req.body;

    if (!["Pending", "Success", "Canceled"].includes(orderStatus)) {
        throw new apiError(400, "Invalid order status");
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });

    if (!updatedOrder) {
        throw new apiError(404, "Order not found");
    }

    return res.status(200).json(new apiResponse(200, updatedOrder, "Order status updated successfully"));
});

// ✅ Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const deletedOrder = await Order.findByIdAndDelete(orderId);

  if (!deletedOrder) {
    throw new apiError(404, "Order not found");
  }

  // ✅ Remove the order ID from the user's `userOrders` array
  const user = await User.findByIdAndUpdate(
    deletedOrder.userId,
    { $pull: { userOrders: orderId } },
    { new: true }
  );

  // ✅ Send cancellation email
  if (user?.email) {
    const userName = user.fullName?.split(" ")[0] || "Customer";
    await sendOrderCancellationEmail(user.email, deletedOrder, userName);
  } else {
    console.warn("User email not found for cancelled order.");
  }

  return res.status(200).json(new apiResponse(200, {}, "Order deleted successfully"));
});


export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
