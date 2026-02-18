import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],   // 🔥 multiple images
  isVeg: Boolean,
  country: String
});

export default mongoose.model("Food", FoodSchema);
