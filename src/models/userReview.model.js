import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
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
    productImage:{
      type:String
    },
    userName: {
      type: String,
      required: true,
    },
    reviewTitle: {
      type: String,
      required: true,
    },
    reviewRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewComment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", reviewSchema);
