const userController = require("../users/users.controller");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("_helpers/db");
const User = db.User;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    let filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      req.fileValidationError = "Forbidden extension";
      return callback(null, false, req.fileValidationError);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 420 * 150 * 200
  }
});

// Register an User
router.post("/register", userController.register);

//Authenticate an User
router.post("/authenticate", userController.authenticate);

//Update Profile
router.post("/update", userController.updateProfile);

//Forget password route
router.post("/forgetpassword", userController.assignToken);

//Set password Route
router.post("/setpassword", userController.setPassword);

//get patient details
router.get("/getinfo/:id", userController.getProfileDetails);

router.post("/uploadImage", upload.any(), (req, res, next) => {
  console.log("it came here");
  const file = req.files;
  console.log(file);
  const id = req.body.id;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  User.findOneAndUpdate(
    { _id: id },
    { $push: { picture: req.files[0].path } },
    { new: true }
  )
    .then(data => {
      res
        .status(200)
        .json({ status: true, message: "Image uploaded successfully", data });
    })
    .catch(error => {
      res.status(200).json({ status: false, message: error });
    });
  // res.send(file);
});

//Delete a Picture
router.post("/picture/delete", (req, res) => {
  let { id, query } = req.body;

  User.findOneAndUpdate(
    { _id: id },
    { $pull: { picture: query } },
    { new: true }
  )
    .then(data => {
      res
        .status(200)
        .json({ status: true, message: "Image deleted successfully", data });
    })
    .catch(error => {
      res.status(200).json({ status: false, message: error });
    });
});

router.post("/attempt", userController.attemptQuiz);
// exporting them
module.exports = router;
