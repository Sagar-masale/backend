import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productId: {
      type: String,
      required: true,
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
