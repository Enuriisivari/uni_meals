import Canteen from "../models/Canteen.js";

export const getAllCanteens = async () => {
  return Canteen.find().sort({ createdAt: -1 });
};

export const getCanteenById = async (id) => {
  return Canteen.findById(id);
};

export const createCanteen = async (payload) => {
  return Canteen.create(payload || {});
};

export const updateCanteen = async (id, payload) => {
  return Canteen.findByIdAndUpdate(id, payload || {}, {
    new: true,
    runValidators: false,
  });
};

export const deleteCanteen = async (id) => {
  return Canteen.findByIdAndDelete(id);
};