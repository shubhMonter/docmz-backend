const razorpayController = require("../razorpay/razorpay.controller");
const express = require("express");
const router = express.Router();

router.post("/createorder", razorpayController.createOrder);

module.exports = router;
