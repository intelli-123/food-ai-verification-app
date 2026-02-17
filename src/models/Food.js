import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  isVeg: Boolean,
  country: String
});

export default mongoose.model("Food", FoodSchema);
