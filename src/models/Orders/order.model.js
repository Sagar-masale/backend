import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "Success", "Cancle"],
      default: "pending",
    },
    orderQuantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true, 
  }
);

export const Order = mongoose.model("Order", orderSchema);
