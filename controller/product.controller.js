const { v4 } = require("uuid");
const { read_file, write_file } = require("../api/file-sytem");
const { time } = require("node:console");

const getAllProducts = (req, res) => {
  try {
    const fileData = read_file("product.json");
    res.status(200).json(fileData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addProduct = (req, res) => {
  try {
    const { title, time } = req.body;
    const fileData = read_file("product.json");

    fileData.push({
      id: v4(),
      title,
      time,
      added_by: req.user.id
    });

    write_file("product.json", fileData);
    res.status(201).json({
      message: "Added new product",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOneProduct = (req, res) => {
  try {
    const { id } = req.params;
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === id);

    if (!foundedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(201).json(foundedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { title, time } = req.body;
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === id);

    if (!foundedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (foundedProduct.added_by !== req.user.id) {
      return res.status(404).json({
        message: "Forbidden",
      });
    }

    fileData.forEach((item) => {
      if (item.id === id) {
        item.title = title ? title : item.title;
        item.time = time ? time : item.time;
      }
    });

    write_file("product.json", fileData);
    res.status(201).json({
      message: "Updated product",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === id);

    if (!foundedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (foundedProduct.added_by !== req.user.id) {
      return res.status(404).json({
        message: "Forbidden",
      });
    }

    fileData.forEach((item, index) => {
      if (item.id === id) {
        fileData.splice(index, 1);
      }
    });

    write_file("product.json", fileData);
    res.status(201).json({
      message: "Deleted product",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
