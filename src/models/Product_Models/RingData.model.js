import mongoose, {Schema} from "mongoose";

const ringDataSchema = new Schema(
    {
        ProductImages: {
            type: String,
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
        adminId: {
            type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true 
        }, // Reference to Admin

}, {timestamps: true});


export const RingData = mongoose.model("RingData", ringDataSchema)