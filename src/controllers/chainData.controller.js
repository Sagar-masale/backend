import { ChainData } from '../models/chainData.model.js';
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to handle adding chain data
const getChainDataWithAdmin = asyncHandler(async (req, res) => {
  console.log("Received files:", req.files); // Debug log for files

  const {
    ProductImages,
    ProductName,
    ProductCategory,
    ProductPrice,
    ProductQty,
    ProductDescription,
    ProductGender,
    adminId,
  } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    throw new apiError(400, "At least one image file is required");
  }

  // Validate other fields
  if (
    !ProductName ||
    !ProductCategory ||
    !ProductPrice ||
    !ProductQty ||
    !ProductDescription ||
    !ProductGender ||
    !adminId
  ) {
    throw new apiError(400, "All fields are required");
  }

  const validAdmin = await Admin.findById(adminId);
  if (!validAdmin) {
    throw new apiError(404, "Invalid admin ID");
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const uploadedImage = await uploadOnCloudinary(file.path);
      console.log("Uploaded image:", uploadedImage);

      if (!uploadedImage || !uploadedImage.url) {
        throw new apiError(400, "Failed to upload one or more images");
      }
      return uploadedImage.url; // Store the URL for each uploaded image
    })
  );

  const newChain = await ChainData.create({
    ProductImages: uploadedImages,
    ProductName,
    ProductCategory,
    ProductPrice,
    ProductQty,
    ProductDescription,
    ProductGender,
    adminId,
  });

  res.status(201).json(
    new apiResponse(201, "Chain data added successfully", {
      chainData: newChain,
    })
  );
});

const getChainData = asyncHandler(async (req, res) => {
  try {
    const chains = await ChainData.find(); // Fetch all chains from the database

    if (!chains || chains.length === 0) {
      throw new apiError(404, "No chains found");
    }

    res.status(200).json(
      new apiResponse(200, "Chains fetched successfully", { chains })
    );
  } catch (error) {
    throw new apiError(500, "Error fetching chain data");
  }
});

const getChainById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json(
        new apiResponse(400, "Product ID is required", null)
      );
    }

    const chain = await ChainData.findById(productId); // Ensure ChainData is imported

    if (!chain) {
      return res.status(404).json(
        new apiResponse(404, "Chain not found", null)
      );
    }

    res.status(200).json(
      new apiResponse(200, "Chain fetched successfully", { product: chain })
    );
  } catch (error) {
    console.error("Error fetching chain by ID:", error);
    res.status(500).json(
      new apiResponse(500, "Error fetching chain by ID", null)
    );
  }
});


export { getChainDataWithAdmin, getChainData, getChainById };
