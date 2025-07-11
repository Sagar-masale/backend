import mongoose, {Schema} from "mongoose";

const mangalsutraDataSchema = new Schema(
    {
        ProductImages: {
            type: Array,
            required: true
        },
        ProductName: {
            type: String,
            required: true,
        },
        ProductCategory: {
            type: String,
            required: true,

        },
        ProductPrice: {
            type: Number,
        },
        metalType: { 
            type: String, 
            enum: ["gold", "silver"], 
            required: true 
        },
        weightInGrams: { 
            type: Number, 
            required: true 
        },
        makingCharges: { 
            type: Number, 
            required: true 
        },
        ProductQty: {
            type: Number,
            required: true,
        },
        ProductDescription: {
            type: String,
            required: true,
        },
        ProductGender: {
            type: String,
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true 
        },

}, {timestamps: true});


export const MangalsutraData = mongoose.model("MangalsutraData", mangalsutraDataSchema)