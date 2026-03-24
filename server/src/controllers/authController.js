import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/authService.js";

function registerErrorResponse(error) {
  const msg =
    typeof error?.message === "string"
      ? error.message
      : String(error ?? "Registration failed");

  if (error?.code === 11000) {
    return { status: 409, error: "An account with this email already exists" };
  }
  if (error?.name === "ValidationError") {
    return { status: 400, error: msg };
  }
  return { status: 400, error: msg };
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("register:", error);
    const { status, error: message } = registerErrorResponse(error);
    res.status(status).json({ error: message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await loginUser(email, password);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};