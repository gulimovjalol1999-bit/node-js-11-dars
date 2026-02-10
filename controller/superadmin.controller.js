const { write_file, read_file } = require("../api/file-sytem");

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = read_file("auth.json");

    const foundedProduct = user.find((item) => item.id === id);

    if (!foundedProduct) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.forEach((item) => {
      if (item.id === id) {
        item.role = role ? role : item.role;
      }
    });

    write_file("auth.json", user);
    res.status(201).json({
      message: "Updated role",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = read_file("auth.json");

    const foundedProduct = user.find((item) => item.id === id);

    if (!foundedProduct) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.forEach((item, index) => {
      if (item.id === id) {
        user.splice(index, 1);
      }
    });

    write_file("auth.json", user);
    res.status(201).json({
      message: "Deleted user",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateRole,
  deleteUser,
};