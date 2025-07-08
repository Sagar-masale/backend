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
          orderQuantity: { type: Number, required: true },
          ProductName:{type:String, required:true},
          ProductImages: {
            type: [String],
            required: true,
          },

          price: Number,
          orderProductSize: { type: String, default:"Default" },
          orderProductWeight: { type: Number, required: true },
          mackingCharges:{type: Number},
          orderedProductPrice:{ type: Number, required: true},
          ProductCouponCode:{type:Number},
          productPrice: {type: Number}
      }
  ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discount:{
      type:Number
    },
    totalAmountWithDiscount:{
      type:Number,
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
