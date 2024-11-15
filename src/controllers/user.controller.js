import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken'


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
    // validation - not empty.
    // check if user already exist: username, email.
    // check for image, check for avatar.
    // upload them to cloudinary, avatar.
    // create user object - create entry in db.
    // remove password and refresh token field from response.
    // check for user creation.
    // return res.


    // console.log(req.body); 


    // get user details from frontend.
    const { userName = '', email = '', fullName = '', password = '' } = req.body || {};
    // console.log("email: ", email);


    // validation - not empty.
    if (
        //check all user data is empty or not ( adv js )
        [userName, email, fullName, password].some((field) => 
        field?.trim()== "")
    ) {
        throw new apiError(400, "All fields are required")
    }

    
    // check if user already exist: username, email.
    const existedUser = await  User.findOne({
        $or: [{ userName }, { email }]
    })

    if(existedUser){
        throw new apiError(409, "userName or email is already exists")
    }


    // check for image, check for avatar.
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    // if(!avatarLocalPath){
    //     throw new apiError(400, "Avatar is required")
    // }


    // upload them to cloudinary, avatar.
    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if(!avatar){
    //     throw new apiError(400, "Avatar is required")     
    // }

    // create user object - create entry in db.
    const user = await User.create({
        fullName,
        email,
        password,
        userName: userName.toLowerCase()
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

        // return res.
        return res.status(201).json(
            new apiResponse(200, createdUser, "user registered successfully")
        )
} )
// Ensure avatar file is provided in the request and uploaded to Cloudinary successfully

// const registerUser = asyncHandler(async (req, res) => {
//     // Get user details from frontend
//     const { userName = '', email = '', fullName = '', password = '' } = req.body || {};

//     // Validation - check fields are not empty
//     if ([userName, email, fullName, password].some((field) => field?.trim() === "")) {
//         throw new apiError(400, "All fields are required");
//     }

//     // Check if user already exists by username or email
//     const existedUser = await User.findOne({
//         $or: [{ userName }, { email }]
//     });

//     if (existedUser) {
//         throw new apiError(409, "Username or email already exists");
//     }

//     // Check for avatar in request
//     const avatarLocalPath = req.files?.avatar?.[0]?.path;
//     if (!avatarLocalPath) {
//         throw new apiError(400, "Avatar is required");
//     }

//     // Upload avatar to Cloudinary
//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     if (!avatar?.url) {
//         throw new apiError(500, "Failed to upload avatar to Cloudinary");
//     }

//     // Upload cover image if available
//     let coverImage;
//     const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
//     if (coverImageLocalPath) {
//         coverImage = await uploadOnCloudinary(coverImageLocalPath);
//     }

//     // Create user object in DB
//     const user = await User.create({
//         fullName,
//         avatar: avatar.url,
//         coverImage: coverImage?.url,
//         email,
//         password,
//         userName: userName.toLowerCase()
//     });

//     // Remove sensitive fields from response
//     const createdUser = await User.findById(user._id).select("-password -refreshToken");

//     if (!createdUser) {
//         throw new apiError(500, "Something went wrong while registering the user");
//     }

//     // Return response
//     return res.status(201).json(
//         new apiResponse(200, createdUser, "User registered successfully")
//     );
// });


const loginUser = asyncHandler( async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email, userName, password} = req.body

    if(!userName && !email) {
        throw new apiError(400, "username or email is required")
    }

    // check email or userName is present in DB 
    const user = await User.findOne({
        // or, and, text, where, nor these all are mongo DB operators
        $or: [{email} , {userName}]
    })

    if(!user) {
        throw new apiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new apiError(401, "Password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}