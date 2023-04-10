const express = require("express");
const uploadRouter = express.Router();
const multer = require("multer");

//storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});


//middleware
const upload = multer({ storage: storage });

//upload images to images folder to change the profiiel
const handleFileUpload = (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ message: "File has been uploaded" });
    }
  });
};

uploadRouter.post("/upload", handleFileUpload);

module.exports = uploadRouter;
