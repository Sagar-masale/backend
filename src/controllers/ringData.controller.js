import {RingData} from "../models/ringData.model.js"
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// Controller to handle adding ring data
const getRingDataWithAdmin = asyncHandler(async (req, res) => {


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

  // Validate other fields
  if (
    !ProductName ||
    !ProductCategory ||
    !ProductQty  ||
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

  const newRing = await RingData.create({
    ProductImages: uploadedImages,
    ProductName,
    ProductCategory,
    metalType, 
    weightInGrams, 
    makingCharges,
    ProductQty,
    ProductDescription,
    ProductGender,
    adminId,
  });

  res.status(201).json(
    new apiResponse(201, "Ring data added successfully", {
      ringData: newRing,
    })
  );
});



const getRingData = asyncHandler(async ( req, res ) => {
  try {
    const rings = await RingData.find();

    if (!rings || rings.length === 0) {
      throw new apiError(404, "No rings found");
    }

    res.status(200).json(
      new apiResponse(200, "Rings fetched successfully", { rings })
    );
  } catch (error) {
    throw new apiError(500, "Error fetching ring data");
  }
});

const getRingById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json(
        new apiResponse(400, "Product ID is required", null)
      );
    }

    const ring = await RingData.findById(productId);

    if (!ring) {
      return res.status(404).json(
        new apiResponse(404, "Ring not found", null)
      );
    }

    res.status(200).json(
      new apiResponse(200, "Ring fetched successfully", { product: ring })
    );
  } catch (error) {
    console.error("Error fetching ring by ID:", error);
    res.status(500).json(
      new apiResponse(500, "Error fetching ring by ID", null)
    );
  }
});


const deleteRingData = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new apiError(400, "Ring ID is required");
  }

  const ring = await RingData.findById(id);

  if (!ring) {
    throw new apiError(404, "Ring not found");
  }

  // Use deleteOne instead of remove()
  await RingData.deleteOne({ _id: id });

  res.status(200).json(
    new apiResponse(200, "Ring data deleted successfully", { id })
  );
});


const updateRingData = asyncHandler(async (req, res) => {
  const { id, ...updateFields } = req.body;

  if (!id) {
    throw new apiError(400, "Ring ID is required");
  }

  const updatedRing = await RingData.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedRing) {
    throw new apiError(404, "Ring not found");
  }

  res.status(200).json(
    new apiResponse(200, "Ring data updated successfully", updatedRing)
  );
});





export { getRingDataWithAdmin, getRingData, deleteRingData, updateRingData, getRingById  };