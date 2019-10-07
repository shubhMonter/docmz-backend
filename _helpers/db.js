const mongoose = require("mongoose");

mongoose.connect("mongodb://dev:admin123@ds217208.mlab.com:17208/docmz", {
  useNewUrlParser: true,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD
});

const db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// mongoose.connect(process.env.DB_CONN);
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
  indexCpt: require("../codes/indexCpt.model"),
  Cpt: require("../codes/cpt.model"),
  Practise: require("../doctor/practise.model"),
  Taxonomy: require("../doctor/taxonomies.model"),
  Address: require("../doctor/address.model"),
  ICD10Index: require("../codes/icd10Index.model.js"),
  ICD10: require("../codes/icd10.model.js"),
  Speciality: require("../codes/speciality.model.js"),
  Carriers: require("../insurance/carriers.model"),
  Plans: require("../insurance/plan.model"),
  Procedure: require("../doctor/procedure.model"),
  Specialty: require("../doctor/specialty.model")
};
