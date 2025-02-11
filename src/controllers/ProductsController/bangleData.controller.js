import { BangleData } from "../../models/Product_Models/bangleData.model.js";
import { Admin } from "../../models/admin.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

// Controller to handle adding bangle data
const getBangleDataWithAdmin = asyncHandler(async (req, res) => {
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

  const newBangle = await BangleData.create({
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
    new apiResponse(201, "Bangle data added successfully", {
      bangleData: newBangle,
    })
  );
});

const getBangleData = asyncHandler(async (req, res) => {
  try {
    const bangles = await BangleData.find(); // Fetch all bangles from the database

    if (!bangles || bangles.length === 0) {
      throw new apiError(404, "No bangles found");
    }

    res.status(200).json(
      new apiResponse(200, "Bangles fetched successfully", { bangles })
    );
  } catch (error) {
    throw new apiError(500, "Error fetching bangle data");
  }
});

export { getBangleDataWithAdmin, getBangleData };