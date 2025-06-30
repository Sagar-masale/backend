import { EarringData } from "../models/earringData.model.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to handle adding earring data
const getEarringDataWithAdmin = asyncHandler(async (req, res) => {
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

  const newEarring = await EarringData.create({
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
    new apiResponse(201, "Earring data added successfully", {
      earringData: newEarring,
    })
  );
});

const getEarringData = asyncHandler(async (req, res) => {
  try {
    const earrings = await EarringData.find(); // Fetch all earrings from the database

    if (!earrings || earrings.length === 0) {
      throw new apiError(404, "No earrings found");
    }

    res.status(200).json(
      new apiResponse(200, "Earrings fetched successfully", { earrings })
    );
  } catch (error) {
    throw new apiError(500, "Error fetching earring data");
  }
});

const getEarringById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json(
        new apiResponse(400, "Product ID is required", null)
      );
    }

    const earring = await EarringData.findById(productId); // Make sure EarringData is imported

    if (!earring) {
      return res.status(404).json(
        new apiResponse(404, "Earring not found", null)
      );
    }

    res.status(200).json(
      new apiResponse(200, "Earring fetched successfully", { product: earring })
    );
  } catch (error) {
    console.error("Error fetching earring by ID:", error);
    res.status(500).json(
      new apiResponse(500, "Error fetching earring by ID", null)
    );
  }
});

const updateEarringData = asyncHandler(async (req, res) => {
  const { id, ...updateFields } = req.body;

  if (!id) {
    throw new apiError(400, "Earring ID is required");
  }

  const updatedEarring = await EarringData.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedEarring) {
    throw new apiError(404, "Earring not found");
  }

  res.status(200).json(
    new apiResponse(200, "Earring data updated successfully", updatedEarring)
  );
});

const deleteEarringData = asyncHandler(async (req, res) => {
  const { id } = req.body; // Get the ID from the request body

  if (!id) {
    throw new apiError(400, "Earring ID is required");
  }

  const earring = await EarringData.findById(id); // Find the earring by ID

  if (!earring) {
    throw new apiError(404, "Earring not found");
  }

  // Use deleteOne instead of remove()
  await EarringData.deleteOne({ _id: id }); // Delete the earring data from the database

  res.status(200).json(
    new apiResponse(200, "Earring data deleted successfully", { id })
  );
});



export { getEarringDataWithAdmin, getEarringData, getEarringById, updateEarringData, deleteEarringData };

