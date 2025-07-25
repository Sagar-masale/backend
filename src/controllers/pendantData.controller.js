import { PendantData } from "../models/pendantData.model.js"
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to handle adding pendant data
const getPendantDataWithAdmin = asyncHandler(async (req, res) => {


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

  const newPendant = await PendantData.create({
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
    new apiResponse(201, "Pendant data added successfully", {
      pendantData: newPendant,
    })
  );
});

const getPendantData = asyncHandler(async (req, res) => {
  try {
    const pendants = await PendantData.find();

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

    const pendant = await PendantData.findById(productId); 

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

const deletePendantData = asyncHandler(async (req, res) => {
  const { id } = req.body; 

  if (!id) {
    throw new apiError(400, "Pendant ID is required");
  }

  const pendant = await PendantData.findById(id);

  if (!pendant) {
    throw new apiError(404, "Pendant not found");
  }

  await PendantData.deleteOne({ _id: id });

  res.status(200).json(
    new apiResponse(200, "Pendant data deleted successfully", { id })
  );
});

const updatePendantData = asyncHandler(async (req, res) => {
  const { id, ...updateFields } = req.body;

  if (!id) {
    throw new apiError(400, "Pendant ID is required");
  }

  const updatedPendant = await PendantData.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedPendant) {
    throw new apiError(404, "Pendant not found");
  }

  res.status(200).json(
    new apiResponse(200, "Pendant data updated successfully", updatedPendant)
  );
});


export { getPendantDataWithAdmin, getPendantData, getPendantById, deletePendantData, updatePendantData };
