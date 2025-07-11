import {BangleData} from "../models/bangleData.model.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getBangleDataWithAdmin = asyncHandler(async (req, res) => {

  const {
    ProductImages,
    ProductName,
    ProductCategory,
    ProductQty,
    ProductDescription,
    ProductGender,
    adminId,
    metalType, weightInGrams, makingCharges
  } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    throw new apiError(400, "At least one image file is required");
  }


  if (
    !ProductName ||
    !ProductCategory ||
    !ProductQty ||
    !ProductDescription ||
    !ProductGender ||
    !adminId ||
    !metalType || 
    !weightInGrams ||
    !makingCharges
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

      if (!uploadedImage || !uploadedImage.url) {
        throw new apiError(400, "Failed to upload one or more images");
      }
      return uploadedImage.url; 
    })
  );

  const newBangle = await BangleData.create({
    ProductImages: uploadedImages,
    ProductName,
    ProductCategory,
    metalType ,
    weightInGrams ,
    makingCharges,
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
    const bangles = await BangleData.find(); 

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

const getBangleById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json(
        new apiResponse(400, "Product ID is required", null)
      );
    }

    const bangle = await BangleData.findById(productId); 

    if (!bangle) {
      return res.status(404).json(
        new apiResponse(404, "Bangle not found", null)
      );
    }

    res.status(200).json(
      new apiResponse(200, "Bangle fetched successfully", { product: bangle })
    );
  } catch (error) {
    console.error("Error fetching bangle by ID:", error);
    res.status(500).json(
      new apiResponse(500, "Error fetching bangle by ID", null)
    );
  }
});

const deleteBangleData = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new apiError(400, "Bangle ID is required");
  }

  const bangle = await BangleData.findById(id);

  if (!bangle) {
    throw new apiError(404, "Bangle not found");
  }

  await BangleData.deleteOne({ _id: id });

  res.status(200).json(
    new apiResponse(200, "Bangle data deleted successfully", { id })
  );
});
const updateBangleData = asyncHandler(async (req, res) => {
  const { id, ...updateFields } = req.body;

  if (!id) {
    throw new apiError(400, "Bangle ID is required");
  }

  const updatedBangle = await BangleData.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedBangle) {
    throw new apiError(404, "Bangle not found");
  }

  res.status(200).json(
    new apiResponse(200, "Bangle data updated successfully", updatedBangle)
  );
});


export { getBangleDataWithAdmin, getBangleData, getBangleById, deleteBangleData,updateBangleData };