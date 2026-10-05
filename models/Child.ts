import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
  parentEmail: String,
  childName: String,
  extensionId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Child || mongoose.model("Child", ChildSchema);
