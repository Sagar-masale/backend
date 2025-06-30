import { MangalsutraData } from "../models/mangalsutraData.model.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to handle adding mangalsutra data
const getMangalsutraDataWithAdmin = asyncHandler(async (req, res) => {
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

  const newMangalsutra = await MangalsutraData.create({
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
    new apiResponse(201, "Mangalsutra data added successfully", {
      mangalsutraData: newMangalsutra,
    })
  );
});

const getMangalsutraData = asyncHandler(async (req, res) => {
  try {
    const mangalsutras = await MangalsutraData.find(); // Fetch all mangalsutras from the database

    if (!mangalsutras || mangalsutras.length === 0) {
      throw new apiError(404, "No mangalsutras found");
    }

    res.status(200).json(
      new apiResponse(200, "Mangalsutras fetched successfully", { mangalsutras })
    );
  } catch (error) {
    throw new apiError(500, "Error fetching mangalsutra data");
  }
});

const getMangalsutraById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json(
        new apiResponse(400, "Product ID is required", null)
      );
    }

    const mangalsutra = await MangalsutraData.findById(productId); // Make sure this model is imported

    if (!mangalsutra) {
      return res.status(404).json(
        new apiResponse(404, "Mangalsutra not found", null)
      );
    }

    res.status(200).json(
      new apiResponse(200, "Mangalsutra fetched successfully", { product: mangalsutra })
    );
  } catch (error) {
    console.error("Error fetching mangalsutra by ID:", error);
    res.status(500).json(
      new apiResponse(500, "Error fetching mangalsutra by ID", null)
    );
  }
});

const deleteMangalsutraData = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new apiError(400, "Mangalsutra ID is required");
  }

  const mangalsutra = await MangalsutraData.findById(id);

  if (!mangalsutra) {
    throw new apiError(404, "Mangalsutra not found");
  }

  await MangalsutraData.deleteOne({ _id: id });

  res.status(200).json(
    new apiResponse(200, "Mangalsutra data deleted successfully", { id })
  );
});
const updateMangalsutraData = asyncHandler(async (req, res) => {
  const { id, ...updateFields } = req.body;

  if (!id) {
    throw new apiError(400, "Mangalsutra ID is required");
  }

  const updatedMangalsutra = await MangalsutraData.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedMangalsutra) {
    throw new apiError(404, "Mangalsutra not found");
  }

  res.status(200).json(
    new apiResponse(200, "Mangalsutra data updated successfully", updatedMangalsutra)
  );
});


export { getMangalsutraDataWithAdmin, getMangalsutraData, getMangalsutraById, deleteMangalsutraData, updateMangalsutraData  };
