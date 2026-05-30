import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  parentEmail: String,
  extensionId: String,
  url: String,
  title: String,
  time: String,
  rawTime: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);