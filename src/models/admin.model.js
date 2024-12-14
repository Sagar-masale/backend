import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema ( 
    {
        adminUserName:{
            type: String,
            required: true
        },
        adminFullName:{
            type: String,
            required: true,
            usique: true,
            lowecase: true,
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
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    }, 
    {
        timestamp: true
    } 
);

export const Admin = mongoose.model("Admin", adminSchema)