const npiController = require("../doctor/practice.controller");
const doctorController = require("../doctor/doctor.controller");
const express = require("express");
const router = express.Router();
const db = require("_helpers/db");
const Practise = db.Practise;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Fetch info about an doctor through a NPI Number
router.get("/getInfo/:npi", npiController.getNpiInfo);

//Upload Doctors to the database through a list of NPI
router.get("/upload", npiController.addDoctors);

//Get all the doctors
router.get("/get", npiController.getAllDoctors);

//Get all procedures
router.get("/get/procedures", doctorController.getProcedures);

//Add all Procedures
router.get("/upload/procedures", doctorController.addProcedures);

//Upload Specialties
router.get("/upload/specialties", doctorController.addSpecialities);

//Get Specialities
router.get("/get/specialties", doctorController.getSpecialty);

//register a Doctor
router.post("/register", npiController.signUpDoc);

//Doctor registeration by Admin
router.post("/registerByAdmin", npiController.registerByAdmin);

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
router.post("/addDoctorsByAdmin", function(req, res) {
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
      npiController
        .addDoctorsByAdmin(req.file.path)
        .then(logs =>
          res
            .status(200)
            .json({ message: req.file, status: true, errorLogs: logs })
        );
    }
  });
});

//Authenticate a doctor
router.post("/authenticate", npiController.authenticateDoctor);

//Update Doctors profile
router.post("/profile/update", npiController.profileUpdate);

//Create and save slots
router.post("/saveslots", npiController.saveSlots);

//Get a doctor through id
router.get("/getdoc/:id", npiController.getDoc);

//Search Doctors
router.post("/search", npiController.searchDocs);

router.post("/searchlite", npiController.searchDocsLite);

//Upload picture

//Multer storage route
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

//Uplaod a picture to doctors profile
router.post("/upload/:id", upload.any(), (req, res) => {
  console.log(req.files);

  if (req.files) {
    let { id } = req.params;
    Practise.findOneAndUpdate(
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
  }
});

//Delete a Picture
router.post("/picture/delete", (req, res) => {
  let { id, query } = req.body;

  Practise.findOneAndUpdate(
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

// exporting them
module.exports = router;
