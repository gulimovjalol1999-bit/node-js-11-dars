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
    const { title, time, isDone } = req.body;
    const fileData = read_file("product.json");

    fileData.push({
      id: v4(),
      title,
      time,
      isDone: false,
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
    const { title, time, } = req.body;
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

const checkBox = (req, res) => {
  try {
    const { id } = req.params;
    const {isDone} = req.body
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === id);

    if (!foundedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (foundedProduct.added_by !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    fileData.forEach((item) => {
      if (item.id === id) {
        item.isDone = !item.isDone;  
      }
    });

    write_file("product.json", fileData);
    
    res.status(200).json({
      message: "Toggled product status",
      isDone: !foundedProduct.isDone
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCompletedTodos = (req, res) => {
  try {
    const {isDone} = req.params
    const todos = read_file('product.json');
    
    const userTodos = todos.filter(todo => todo.added_by === req.user.id);
    const completedCount = userTodos.filter(todo => todo.isDone).length;

    if (completedCount === 0) {
      return res.status(400).json({
        message: "Bajarilgan todolar yo'q"
      });
    }

    const filteredTodos = todos.filter(
      todo => !(todo.added_by === req.user.id && todo.isDone)
    );

    write_file('product.json', filteredTodos);

    res.status(200).json({
      message: `${completedCount} ta bajarilgan todo o'chirildi`
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getTodoStats = (req, res) => {
  try {
    const todos = read_file('product.json');
    const userTodos = todos.filter(todo => todo.added_by === req.user.id);

    const total = userTodos.length;
    const completed = userTodos.filter(todo => todo.isDone).length;
    const pending = total - completed;

    res.status(200).json({
      total,
      completed,
      pending,
      message: `jami ${total} shart ${completed} bajarilgan`
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  checkBox,
  deleteCompletedTodos,
  getTodoStats
};
