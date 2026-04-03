import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

const DEMO_ADMIN = {
  name: "System Admin",
  email: "admin@unimeals.com",
  password: "admin123",
};

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const existing = await Admin.findOne({ email: DEMO_ADMIN.email.toLowerCase() });
  
  if (existing) {
    console.log("Admin user already exists in database:", DEMO_ADMIN.email);
    // Maybe update password just in case?
    const hashedPassword = await bcrypt.hash(DEMO_ADMIN.password, 10);
    existing.password = hashedPassword;
    await existing.save();
    console.log("Updated password to guarantee login.");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(DEMO_ADMIN.password, 10);
  await Admin.create({
    name: DEMO_ADMIN.name,
    email: DEMO_ADMIN.email.toLowerCase(),
    password: hashedPassword,
  });

  console.log("Seeded demo admin user into MongoDB:");
  console.log("  Email:", DEMO_ADMIN.email);
  console.log("  Password:", DEMO_ADMIN.password);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
