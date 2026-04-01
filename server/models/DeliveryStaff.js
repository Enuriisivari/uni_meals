import mongoose from 'mongoose';

const deliveryStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  vehicleType: { type: String },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Offline' },
  activeToken: { type: String, default: null }, // The "Creative" Token
  totalDeliveries: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 }
});

const DeliveryStaff = mongoose.model('DeliveryStaff', deliveryStaffSchema);
export default DeliveryStaff;