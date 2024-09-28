import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


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
    console.log("email: ", email);


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
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar is required")
    }


    // upload them to cloudinary, avatar.
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400, "Avatar is required")     
    }

    // create user object - create entry in db.
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
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

const loginUser = asyncHandler( async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email, userName, password} = req.body

    if(!userName || !email) {
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
    
})



export {
    registerUser,
    loginUser
}