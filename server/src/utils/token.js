import jwt from "jsonwebtoken";

export const generateAuthToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

export const verifyAuthToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
