import mongoose from "mongoose";

const deliveryPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    
    phone: {
      type: String,
      required: false,
    },

    vehicleType: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryPerson", deliveryPersonSchema);
