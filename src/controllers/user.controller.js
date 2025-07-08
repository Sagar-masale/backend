import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken'
import { sendRegistrationEmail } from "../Auth/sendRegistrationEmail.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        // assign userRefreshToken to refreshToken
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new apiError(500, "somthing went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {



    // get user details from frontend.
    const {email = '', fullName = '', password = '',phoneNumber= '' } = req.body || {};
    // console.log("email: ", email);


    // validation - not empty.
    if (
        //check all user data is empty or not ( adv js )
        [email, fullName, password, phoneNumber].some((field) => 
        field?.trim()== "")
    ) {
        throw new apiError(400, "All fields are required")
    }

    
    // check if user already exist: phoneNumber, email.
    const existedUser = await  User.findOne({
        $or: [{ phoneNumber }, { email }]
    })

    if (existedUser) {
        return res.status(400).json({ 
            message: "This email or phone number is already registered." 
        });
    }
    
    
    // create user object - create entry in db.
    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber
    })

    // remove password and refresh token field from response.
    const createdUser = await User.findById(user._id)
        .select(
            "-password -refreshToken"
        )

        // check for user creation.
    
        if(!createdUser){
            throw new apiError(500, "somthing went wrong while regersting the user")
        }
        await sendRegistrationEmail(email, fullName);

        // return true res.
        return res.status(201).json(
            new apiResponse(200, createdUser, "user registered successfully")
        )
} )



const loginUser = asyncHandler( async (req, res) => {
    // req body -> data
    // phoneNumer or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email,phoneNumber, password} = req.body

    if(!phoneNumber && !email) {
        throw new apiError(400, "phoneNumber or email is required")
    }

    // check email or phoneNumber is present in DB 
    const user = await User.findOne({
        // or, and, text, where, nor these all are mongo DB operators
        $or: [{email} , {phoneNumber}]
    })

    // if(!user) {
    //     throw new apiError(404, "User does not exist")
    //     return res new apiResponse.status(404).json({ message: "User does not exist" });
    // }
    if (!user) {
        return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        return res.status(401).json({ message: "Password is incorrect" });
    }
 

    
       
 

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken").populate("userOrders");
    

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
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
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
    .json(new apiResponse(200, {}, "User logged Out"))
})

const updateUser = asyncHandler(async (req, res) => {
    const { userId, password, ...updates } = req.body;

    // Remove empty fields (undefined, null, or empty string)
    const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value?.toString().trim())
    );

    // If no fields are provided, return an error
    if (Object.keys(filteredUpdates).length === 0 && !password) {
        throw new apiError(400, "At least one field is required to update");
    }

    // Include password only if provided
    if (password) {
        filteredUpdates.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: filteredUpdates },
        { new: true, runValidators: true, context: 'query' }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(
        new apiResponse(200, updatedUser, "User updated successfully")
    );
});



const refreshAccessToken = asyncHandler(async(req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if(!user){
         throw new apiError(401, "Invalid refresh token")
     }
 
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new apiError(401, "Refresh token is expired or used")
     }
 
     const options ={
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
 
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
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUser
}