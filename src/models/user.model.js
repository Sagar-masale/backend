import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        addressLine1: {
            type: String,
            required: false,
            trim: true, 
            index: true
        },
        addressLine2: {
            type: String,
            required: false,
            trim: true, 
            index: true
        },
        country: {
            type: String,
            required: false,
            trim: true, 
            index: true
        },
        city: {
            type: String,
            required: false,
            trim: true, 
            index: true
        },
        state: {
            type: String,
            required: false,
            trim: true, 
            index: true
        },
        zipCode: {
            type: String,
            required: false,
            trim: true, 
            index: true
        },
        otp: {
            type: String
        },
        otpExpires: {
            type: Date
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        userOrders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order", 
        }],
        
        
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10); 
    next();
});


userSchema.methods.isPasswordCorrect = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); 
};


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName  
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};



export const User = mongoose.model("User", userSchema)