const npiController = require("../doctor/practise.controller");
const doctorController = require("../doctor/doctor.controller");
const express = require("express");
const router = express.Router();

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

//Authenticate a doctor
router.post("/authenticate", npiController.authenticateDoctor);

//Update Doctors profile
router.post("/profile/update", npiController.profileUpdate);

// exporting them
module.exports = router;
