const userController = require("../users/users.controller");
const express = require("express");
const router = express.Router();
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage });

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

router.post(
  "/uploadImage",
  upload.single("myFile"),
  userController.uploadImage
);

// exporting them
module.exports = router;
