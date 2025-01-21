import { EarringData } from "../../models/Product_Models/earringData.model.js";
import { Admin } from "../../models/admin.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

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

export { getEarringDataWithAdmin, getEarringData };
