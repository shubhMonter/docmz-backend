const userController = require("../users/users.controller");
const express = require("express");
const router = express.Router();

// Register an User
router.get("/register", userController.register);

//Authenticate an User
router.get("/authenticate", userController.authenticate);

// exporting them
module.exports = router;
