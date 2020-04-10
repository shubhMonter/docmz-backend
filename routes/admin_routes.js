const adminController = require("../admin/admin.controller");

const express = require("express");
const router = express.Router();
const db = require("_helpers/db");
const Practise = db.Practise;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Patient routes

//Add Patient
router.post("/patient/add", adminController.addPatient);

//Get Patient
router.get("/patient/get", adminController.getPatient);

//Update Patient
router.post("/patient/update", adminController.updatePatient);

//Specialty routes

//Get specialities

router.get("/specialty/get", adminController.getSpecialty);

//add Specialty
router.post("/specialty/add", adminController.addSpecialty);

//Doctor Routes

//Update Specialty
router.post("/specialty/update", adminController.updateSpecialty);

//Search doctors
router.post("/doctors/searchlite", adminController.searchDocsLite);

//Doctor registeration by Admin
router.post("/doctors/register", adminController.registerByAdmin);

var storageCSV = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  }
});
var uploadCSV = multer({
  storage: storageCSV,
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".csv" && ext !== ".xls" && ext !== ".xlsx") {
      req.fileValidationError = "Only csv and excel allowed";
      return callback(new Error("Only csv and excel allowed"), false);
    }
    callback(null, true);
  }
}).single("file");
//read from csv and register
router.post("/doctors/addCSV", function(req, res) {
  console.log("file", req.file);
  // if (req.files && req.files.length > 0) {
  // 	res.status(200).json({ message: req.file, status: true });
  // } else {
  // 	res.status(500).json({ message: req.file, status: false });
  // }
  // console.log("body got ", req.body);

  uploadCSV(req, res, async function(err) {
    if (req.fileValidationError) {
      res.status(500).json({
        message: req.fileValidationError,
        status: false
      });
    } else if (err instanceof multer.MulterError) {
      return res.status(500).json({ status: false, message: err });
    } else if (err) {
      return res.status(500).json({ status: false, message: err });
    } else {
      console.log("path", req.file.path);
      adminController
        .addDoctorsByAdmin(req.file.path)
        .then(logs =>
          res
            .status(200)
            .json({ message: req.file, status: true, errorLogs: logs })
        );
    }
  });
});

module.exports = router;
