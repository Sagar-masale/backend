import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
          productId: { type: mongoose.Schema.Types.ObjectId, required: true },
          orderQuantity: { type: Number, required: true }
      }
  ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Success", "Canceled"],
      default: "Pending",
    },
  },
  {
    timestamps: true, 
  }
);

export const Order = mongoose.model("Order", orderSchema);
