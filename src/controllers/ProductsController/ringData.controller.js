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

  


  // Validate other fields
  if (
    !req.file ||
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

//   const ringLocalPath = req.files?.ProductImages[0]?.path;

//   if (!ringLocalPath) {
//     throw new apiError(400, "Avatar file is required")
// }
  const RingImage = await uploadOnCloudinary(req.file.path)

  if (!RingImage) {
    throw new apiError(400, "image file is required")
  }

  

  // // Get the uploaded image URL from Cloudinary
  // const imagePath = req.file.path;

  // Add ring data to the database
  const newRing = await RingData.create({
    ProductImages: RingImage.url, // Store the Cloudinary URL
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
