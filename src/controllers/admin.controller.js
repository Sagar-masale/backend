import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Admin } from "../models/admin.model.js"

import { apiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async(adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = Admin.generateAccessToken()
        const refreshToken = Admin.generateRefreshToken()
        
        // assign userRefreshToken to refreshToken
        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new apiError(500, "somthing went wrong while generating refresh and access token")
    }
}


const loginAdmin = asyncHandler( async (req, res) => {
    // req body -> data
    // phoneNumer or email
    // find the admin
    // password check
    // access and refresh token
    // send cookie

    const {adminEmail,adminPhoneNumber, adminPassword} = req.body

    if(!adminEmail && !adminPhoneNumber) {
        throw new apiError(400, "phoneNumber or email is required")
    }

    // check email or phoneNumber is present in DB 
    const admin = await Admin.findOne({
        // or, and, text, where, nor these all are mongo DB operators
        $or: [{adminEmail} , {adminPhoneNumber}]
    })

   
    if (!admin) {
        return res.status(404).json({ message: "Admin does not exist" });
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if(!isPasswordValid) {
        return res.status(401).json({ message: "Password is incorrect" });
    }
 

    
       
 

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-adminPassword  -refreshToken")
    

    //  pass cookie 
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                admin: loggedInAdmin, accessToken, refreshToken
            },
            "Admin logged in successfully"
        )
    )

})

const logoutAdmin = asyncHandler(async(req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            // $set is a mongoDB operator use to update a value
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Admin logged Out"))
})


const refreshAccessTokenAdmin = asyncHandler(async(req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const admin = await Admin.findById(decodedToken?._id)
 
     if(!admin){
         throw new apiError(401, "Invalid refresh token")
     }
 
     if (incomingRefreshToken !== admin?.refreshToken) {
         throw new apiError(401, "Refresh token is expired or used")
     }
 
     const options ={
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(admin._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new apiResponse(
             200,
             {accessToken, refreshToken:newRefreshToken},
             "Access token refreshed"
         )
     )
   } catch (error) {
        throw new apiError(error?.message || "Invalid refresh token")
   }
})

const getCurrentAdmin = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req.admin,
        "Admin fetched successfully"
    ))
})

export {
    loginAdmin,
    logoutAdmin,
    refreshAccessTokenAdmin,
    getCurrentAdmin
}
