import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  orderId: { type: String, required: true }, // Links feedback to a specific order
  userId: { type: String, required: true },  // Who gave the feedback
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;