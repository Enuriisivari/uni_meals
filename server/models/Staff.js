import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  staffId: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model("Staff", staffSchema);
