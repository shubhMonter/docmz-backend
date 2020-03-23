const questionnaireController = require("../questionnaire/questionnaire.controller");
const express = require("express");
const router = express.Router();

// Add a question
router.post("/addQuestion", questionnaireController.addQuestion);

//Get all question
router.post("/getQuestion", questionnaireController.getQuestion);

// exporting them
module.exports = router;
