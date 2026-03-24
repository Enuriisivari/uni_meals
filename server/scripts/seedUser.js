/**
 * Optional: create a demo student in MongoDB.
 * From the server folder: node scripts/seedUser.js
 * Requires server/.env with MONGO_URI
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/userModel.js";

const DEMO = {
  name: "Demo Student",
  email: "student@university.edu",
  password: "demo1234",
};

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const existing = await User.findOne({ email: DEMO.email.toLowerCase() });
  if (existing) {
    console.log("Demo user already exists:", DEMO.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(DEMO.password, 10);
  await User.create({
    name: DEMO.name,
    email: DEMO.email.toLowerCase(),
    password: hashedPassword,
  });

  console.log("Seeded demo user:");
  console.log("  Email:", DEMO.email);
  console.log("  Password:", DEMO.password);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
