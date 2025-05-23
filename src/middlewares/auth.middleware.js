import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";





// export const verifyJWT = asyncHandler(async (req, _, next) => {
//     try {
//         // Extract the token from cookies or Authorization header
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//         if (!token) {
//             throw new apiError(401, "Unauthorized request");
//         }

//         // Verify the token
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // Check if the token belongs to a User
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
//         if (user) {
//             req.user = user; // Attach the user to the request
//             return next(); // Continue to the next middleware or route
//         }

//         // Check if the token belongs to an Admin
//         const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
//         if (admin) {
//             req.admin = admin; // Attach the admin to the request
//             return next(); // Continue to the next middleware or route
//         }

//         // If neither User nor Admin is found, throw an error
//         throw new apiError(401, "Invalid Access Token");
//     } catch (error) {
//         // Handle token verification or other errors
//         throw new apiError(401, error?.message || "Invalid access token");
//     }
// });

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new apiError(401, "Unauthorized request");
        }

        // Try verifying the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (user) {
            req.user = user;
            return next();
        }

        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
        if (admin) {
            req.admin = admin;
            return next();
        }

        throw new apiError(401, "Invalid Access Token");

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new apiError(401, "Access Token Expired");
        }

        throw new apiError(401, error?.message || "Invalid access token");
    }
});
