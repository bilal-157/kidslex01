import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  parentEmail: String,
  extensionId: String,
  latitude: Number,
  longitude: Number,
  time: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);