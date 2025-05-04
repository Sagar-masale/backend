import {RingData} from "../models/ringData.model.js"
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// Controller to handle adding ring data
const getRingDataWithAdmin = asyncHandler(async (req, res) => {
  // console.log("Received files:", req.files); // Debug log for files

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
    !ProductPrice  ||
    !ProductQty  ||
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

  const newRing = await RingData.create({
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
    new apiResponse(201, "Ring data added successfully", {
      ringData: newRing,
    })
  );
});



const getRingData = asyncHandler(async ( req, res ) => {
  try {
    const rings = await RingData.find(); // Fetch all rings from the database

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


const deleteRingData = asyncHandler(async (req, res) => {
  const { id } = req.body; // Get the ID from the request body

  if (!id) {
    throw new apiError(400, "Ring ID is required");
  }

  const ring = await RingData.findById(id); // Find the ring by ID

  if (!ring) {
    throw new apiError(404, "Ring not found");
  }

  // Use deleteOne instead of remove()
  await RingData.deleteOne({ _id: id }); // Delete the ring data from the database

  res.status(200).json(
    new apiResponse(200, "Ring data deleted successfully", { id })
  );
});



export { getRingDataWithAdmin, getRingData, deleteRingData  };