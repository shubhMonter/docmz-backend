const stripeController = require("../stripe/stripe.controller");
const express = require("express");
const router = express.Router();

// Create a card and save it to the user object
router.post("/create/card/profile", stripeController.createCardProfile);

//charge a profile
router.post("/charge/profile", stripeController.profileCharge);

//Create a profile
router.post("/create/profile", stripeController.createProfile);

//List saved cards from stripe
router.get("/list/:customer", stripeController.listCards);

// exporting them
module.exports = router;
