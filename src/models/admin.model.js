import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminSchema = new Schema ( 
    {
        adminUserName:{
            type: String,
            required: true
        },
        adminFullName:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        adminPhoneNumber:{
            type: String,
            required: true,
            unique: true,
        },
        adminEmail: {
            type: String,
            required: true,
            unique: true,
        },
        adminPassword: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        },
        

    }, 
    {
        timestamps: true
    } 
);


adminSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("adminPassword")) return next();
        this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
        next();
    } catch (error) {
        next(error);
    }
});


adminSchema.methods.isPasswordCorrect = async function(adminPassword){
    return await bcrypt.compare(adminPassword, this.adminPassword)
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            adminEmail: this.adminEmail,
            adminUserName: this.adminUserName,
            adminFullName: this.adminFullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
