import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Review } from "../models/userReview.model.js";

// Create Review
const createReview = asyncHandler(async (req, res) => {
    const { userId, productId, userName, reviewTitle, reviewRating, reviewComment } = req.body;

    if (!userId || !productId || !reviewTitle || !reviewRating || !reviewComment) {
        throw new apiError(400, "All fields are required");
    }

    const review = await Review.create({
        userId,
        productId,
        userName,
        reviewTitle,
        reviewRating,
        reviewComment
    });

    return res.status(201).json(new apiResponse(201, review, "Review added successfully"));
});

const getReviewsByProduct = asyncHandler(async (req, res) => {
    const { productId } = req.query; // Change from req.body to req.query

    if (!productId) {
        throw new apiError(400, "Product ID is required");
    }

    const reviews = await Review.find({ productId });

    return res.status(200).json(new apiResponse(200, reviews, "Reviews fetched successfully"));
});


const getAllReview = asyncHandler(async( req, res) => {
    const allReviewa = await Review.find();
    return res.status(200).json(new apiResponse(200, allReviewa, "Reviews fetched successfully"));
})

// Get Reviews by User ID
const getReviewsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new apiError(400, "User ID is required");
    }

    const reviews = await Review.find({ userId });

    return res.status(200).json(new apiResponse(200, reviews, "User reviews fetched successfully"));
});

// Update Review
const updateReview = asyncHandler(async (req, res) => {
    const { reviewId, reviewTitle, reviewRating, reviewComment } = req.body;

    if (!reviewId) {
        throw new apiError(400, "Review ID is required");
    }

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { $set: { reviewTitle, reviewRating, reviewComment } },
        { new: true, runValidators: true }
    );

    if (!updatedReview) {
        throw new apiError(404, "Review not found");
    }

    return res.status(200).json(new apiResponse(200, updatedReview, "Review updated successfully"));
});

// Delete Review
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.body;

    if (!reviewId) {
        throw new apiError(400, "Review ID is required");
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
        throw new apiError(404, "Review not found");
    }

    return res.status(200).json(new apiResponse(200, {}, "Review deleted successfully"));
});

export {
    createReview,
    getReviewsByProduct,
    getReviewsByUser,
    updateReview,
    deleteReview,
    getAllReview
};
