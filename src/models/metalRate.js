import mongoose from "mongoose";

const metalRateSchema = new mongoose.Schema({
  gold: { 
    type: Number, 
    required: true 
},
  silver: { 
    type: Number, 
    required: true 
},
  updatedAt: { 
    type: Date, 
    default: Date.now 
}
});

export default mongoose.model("MetalRate", metalRateSchema);