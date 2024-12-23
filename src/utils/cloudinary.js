import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is missing. Check environment variables.");
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        console.error("Error: No file path provided for upload.");
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect the file type
        });
        console.log("File uploaded successfully:", response.url);
        fs.unlinkSync(localFilePath); // Remove the local file after upload
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // Safely delete file
        return null;
    }
};

export { uploadOnCloudinary };
