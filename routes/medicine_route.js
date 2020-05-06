const router = require("express").Router();
const medicineController = require("../medicine/medicine.controller");

router.post("/add", medicineController.addMedicine);

module.exports = router;
