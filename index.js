const express = require("express");
const cors = require("cors");
const authRouter = require("./router/auth.routes");
const productRouter = require("./router/product.routes");
const superadminRouter = require("./router/superadmin.routes");
const multer = require("multer");
const path = require("path"); 
const { read_file, write_file } = require("./api/file-sytem");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


// app.use("/", (req, res) => {
//   res.status(200).json({ message: "ishladi" });
// });

const storage = multer.diskStorage({
  destination: "./upload/image",
  filename: (req, file, cb) => {
    const uniqueName = file.fieldname + Date.now();
    const ext = path.extname(file.originalname)
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage });

app.use("/upload", express.static("upload"));

//get_all
app.get("/get_all_pictures", (req, res) => {
  try {
    const fileData = read_file("product.json");
    res.status(200).json(fileData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
})

//post
app.post("/add_data", upload.single("file"), (req, res) => {
  try {
    const { title, category } = req.body;
    const fileData = read_file("product.json");

    fileData.push({
      id: Date.now(),
      title,
      category,
      image_path: `http://localhost:4001/upload/image/` + req.file.filename
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
});

//getone
app.get("/get_one/:id", (req, res) => {
  try {
    const { id } = req.params;
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === Number(id));

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
})

//update
app.put("/update_picture/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, } = req.body;
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === Number(id));

    if (!foundedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }


    fileData.forEach((item) => {
      if (item.id === Number(id)) {
        item.title = title ? title : item.title;
        item.category = category ? category : item.category;

      }
    });

    write_file("product.json", fileData);
    res.status(200).json({
      message: "Updated product",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
})

//delete
app.delete("/delete_picture/:id", (req, res) => {
  try {
    const { id } = req.params;
    const fileData = read_file("product.json");

    const foundedProduct = fileData.find((item) => item.id === Number(id));

    if (!foundedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    fileData.forEach((item, index) => {
      if (item.id === Number(id)) {
        fileData.splice(index, 1);
      }
    });

    write_file("product.json", fileData);
    res.status(200).json({
      message: "Deleted product",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
})


//router
app.use(productRouter);
app.use(authRouter);
app.use(superadminRouter);


app.listen(PORT, () => {
  console.log(PORT);
});
