import { PendantData } from "../models/pendantData.model.js"
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to handle adding pendant data
const getPendantDataWithAdmin = asyncHandler(async (req, res) => {
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

  const newPendant = await PendantData.create({
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
    new apiResponse(201, "Pendant data added successfully", {
      pendantData: newPendant,
    })
  );
});

const getPendantData = asyncHandler(async (req, res) => {
  try {
    const pendants = await PendantData.find(); // Fetch all pendants from the database

    if (!pendants || pendants.length === 0) {
      throw new apiError(404, "No pendants found");
    }

    res.status(200).json(
      new apiResponse(200, "Pendants fetched successfully", { pendants })
    );
  } catch (error) {
    throw new apiError(500, "Error fetching pendant data");
  }
});
const getPendantById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json(
        new apiResponse(400, "Product ID is required", null)
      );
    }

    const pendant = await PendantData.findById(productId); // Ensure PendantData is imported

    if (!pendant) {
      return res.status(404).json(
        new apiResponse(404, "Pendant not found", null)
      );
    }

    res.status(200).json(
      new apiResponse(200, "Pendant fetched successfully", { product: pendant })
    );
  } catch (error) {
    console.error("Error fetching pendant by ID:", error);
    res.status(500).json(
      new apiResponse(500, "Error fetching pendant by ID", null)
    );
  }
});


export { getPendantDataWithAdmin, getPendantData, getPendantById };
