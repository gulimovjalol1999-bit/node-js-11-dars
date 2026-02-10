const { v4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { read_file, write_file } = require("../api/file-sytem");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, password are required",
      });
    }

    const users = read_file("auth.json");

    foundedUser = users.find((item) => item.email === email);

    if (foundedUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const hash = await bcrypt.hash(password, 12);

    users.push({
      id: v4(),
      username,
      email,
      password: hash,
      role: "user",
    });

    write_file("auth.json", users);

    res.status(200).json({
      message: "Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email, password are required",
      });
    }

    const users = read_file("auth.json");

    foundedUser = users.find((item) => item.email === email);

    if (!foundedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const check = await bcrypt.compare(password, foundedUser.password);

    if (check) {
      const payload = {
        role: foundedUser.role,
        email: foundedUser.email,
        id: foundedUser.id,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Success",
        token,
      });
    } else {
      return res.status(401).json({
        message: "Wrong password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
