const userController = require("../users/users.controller");
const express = require("express");
const router = express.Router();

// Register an User
router.post("/register", userController.register);

//Authenticate an User
router.post("/authenticate", userController.authenticate);

// exporting them
module.exports = router;
