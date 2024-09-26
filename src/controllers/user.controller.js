import { asyncHandler } from "../utils/asyncHandler.js";


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

    const { userName = '', email = '', fullName = '', password = '' } = req.body || {};
    console.log("email: ", email);

} )

export {
    registerUser
}