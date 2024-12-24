import { RingData } from "../../models/Product_Models/ringData.model.js";
import { Admin } from "../../models/admin.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";


// Controller to handle adding ring data
const getRingDataWithAdmin = asyncHandler(async (req, res) => {
  const {
    ProductImages,
    ProductName,
    ProductCategory,
    ProductPrice,
    ProductQty,
    ProductDescription,
    adminId,
  } = req.body;

  
  const files = req.files;

  if (!files || files.length === 0) {
    throw new apiError(400, "At least one image file is required");
  }
  
  console.log("Uploaded files:", files);
  
  
  // Validate other fields
  if (
    !ProductName ||
    !ProductCategory ||
    !ProductPrice  ||
    !ProductQty  ||
    !ProductDescription ||
    !adminId
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Check if the admin exists
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
      return uploadedImage.url; // Store the URL for each uploaded image
    })
  );
  

  

  // // Get the uploaded image URL from Cloudinary
  // const imagePath = req.file.path;

  // Add ring data to the database
  const newRing = await RingData.create({
    ProductImages: uploadedImages, // Store array of image URLs
    ProductName,
    ProductCategory,
    ProductPrice,
    ProductQty,
    ProductDescription,
    adminId,
  });
  

  // Send success response
  res.status(201).json(
    new apiResponse(201, "Ring data added successfully", {
      ringData: newRing,
    })
  );
});

export { getRingDataWithAdmin };
