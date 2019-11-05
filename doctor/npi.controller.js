const db = require("_helpers/db"),
  express = require("express"),
  app = express(),
  request = require("request");
(csvParser = require("csv-parse")), (fs = require("fs"));
(Practise = db.Practise), (Taxonomy = db.Taxonomy), (Address = db.Address);
(crypto = require("crypto")), (algorithm = "aes-256-cbc");
let key = "abcdefghijklmnopqrstuvwxyztgbhgf";
let iv = "1234567891234567";
let filePathForDoctors = "./doctor/doctors.csv";
let Jwt = require("../_helpers/jwt");
var jwt = require("jsonwebtoken");
//Function to upload the CPT codes from the CSV file to the MongoDb Database
function addDoctors(req, res) {
  //Reading the File
  fs.readFile(
    filePathForDoctors,
    {
      encoding: "utf-8"
    },
    async function(err, csvData) {
      if (err) {
        console.log(err);
      }

      csvParser(
        csvData,
        {
          delimiter: ","
        },
        async function(err, data) {
          if (err) {
            console.log(err);
          } else {
            data.map(el => {
              //Requesting the Info of the doctor from the NPI Database
              const NPIApi =
                `https://npiregistry.cms.hhs.gov/api/?number=` +
                el +
                `&version=2.0`;

              request.get(NPIApi, async function(err, resp, body) {
                let doctorInfoq = JSON.parse(resp.body);
                let doctorInfo = doctorInfoq.results[0];
                //Checking if the Doctor Already exists
                let ifExists = await Practise.findOne({
                  npi: doctorInfo.number
                });

                if (ifExists) {
                  console.log("A Doctor with this NPI Number already exists");
                } else {
                  let addressArray = [];
                  if (doctorInfo.addresses) {
                    doctorInfo.addresses.map(el => {
                      let address = new Address({
                        country_code: el.country_code,
                        country_name: el.country_name,
                        address_purpose: el.address_purpose,
                        address_type: el.address_type,
                        address_1: el.address_1,
                        address_2: el.address_2,
                        city: el.city,
                        state: el.state,
                        postal_code: el.postal_code,
                        telephone_number: el.telephone_number
                      });
                      address.save().catch(console.log);
                      addressArray.push(address._id);
                    });
                  }

                  let practiceLocationsArray = [];
                  if (doctorInfo.practiceLocations) {
                    doctorInfo.practiceLocations.map(el => {
                      let address = new Address({
                        country_code: el.country_code,
                        country_name: el.country_name,
                        address_purpose: el.address_purpose,
                        address_type: el.address_type,
                        address_1: el.address_1,
                        address_2: el.address_2,
                        city: el.city,
                        state: el.state,
                        postal_code: el.postal_code,
                        telephone_number: el.telephone_number
                      });
                      address.save().catch(console.log);
                      practiceLocationsArray.push(address._id);
                    });
                  }

                  let taxonomiesArray = [];
                  if (doctorInfo.taxonomies) {
                    doctorInfo.taxonomies.map(el => {
                      let taxonomies = new Taxonomy({
                        code: el.code,
                        desc: el.desc,
                        primary: el.primary,
                        state: el.state,
                        licence: el.licence,
                        taxonomy_group: el.taxonomy_group
                      });
                      taxonomies.save().catch(console.log);
                      taxonomiesArray.push(taxonomies._id);
                    });
                  }

                  let basic = {};
                  let doctorInfoBasic = doctorInfo.basic;
                  basic.organization_name = doctorInfoBasic.organization_name
                    ? doctorInfoBasic.organization_name
                    : "not found";
                  basic.organizational_subpart = doctorInfoBasic.organizational_subpart
                    ? doctorInfoBasic.organizational_subpart
                    : "not found";
                  basic.enumeration_date = doctorInfoBasic.enumeration_date
                    ? doctorInfoBasic.enumeration_date
                    : "not found";
                  basic.last_updated = doctorInfoBasic.last_updated
                    ? doctorInfoBasic.last_updated
                    : "not found";
                  basic.status = doctorInfoBasic.status
                    ? doctorInfoBasic.status
                    : "not found";
                  basic.credential = doctorInfoBasic.authorized_official_credential
                    ? doctorInfoBasic.authorized_official_credential
                    : doctorInfoBasic.credential;
                  basic.first_name = doctorInfoBasic.authorized_official_first_name
                    ? doctorInfoBasic.authorized_official_first_name
                    : doctorInfoBasic.first_name;
                  basic.last_name = doctorInfoBasic.authorized_official_last_name
                    ? doctorInfoBasic.authorized_official_last_name
                    : doctorInfoBasic.last_name;
                  basic.middle_name = doctorInfoBasic.authorized_official_middle_name
                    ? doctorInfoBasic.authorized_official_middle_name
                    : doctorInfoBasic.middle_name;
                  basic.telephone_number = doctorInfoBasic.authorized_official_telephone_number
                    ? doctorInfoBasic.authorized_official_telephone_number
                    : "not found";
                  basic.title_or_position = doctorInfoBasic.authorized_official_title_or_position
                    ? doctorInfoBasic.authorized_official_title_or_position
                    : "not found";
                  basic.name_prefix = doctorInfoBasic.name_prefix
                    ? doctorInfoBasic.name_prefix
                    : "not found";
                  basic.name_suffix = doctorInfoBasic.name_suffix
                    ? doctorInfoBasic.name_suffix
                    : "not found";
                  basic.sole_proprietor = doctorInfoBasic.sole_proprietor
                    ? doctorInfoBasic.sole_proprietor
                    : "not found";
                  basic.gender = doctorInfoBasic.gender
                    ? doctorInfoBasic.gender
                    : "not found";
                  basic.name = doctorInfoBasic.name
                    ? doctorInfoBasic.name
                    : "not found";

                  setTimeout(function() {
                    let practise = new Practise({
                      enumerationType: doctorInfo.enumeration_type,
                      npi: doctorInfo.number,
                      last_updated_epoch: doctorInfo.last_updated_epoch,
                      created_epoch: doctorInfo.created_epoch,
                      basic,
                      other_names: doctorInfo.other_names,
                      address: addressArray,
                      taxonomies: taxonomiesArray,
                      practiceLocation: practiceLocationsArray,
                      identifiers: doctorInfo.identifiers
                    });

                    //Saving the Doctor Info
                    practise.save(function(err) {
                      if (err) {
                        console.log({ err });
                        if (err.name === "MongoError" && err.code === 11000) {
                          console.log("This Doctor already exists");
                        }
                      }
                    });
                  }, 3000);
                }
              });
            });
          }
        }
      );
    }
  );
  res.json({ status: true });
}

//API Call to NPI Database with response as parameter
function getNPI(npiNumber, response) {
  const NPIApi =
    `https://npiregistry.cms.hhs.gov/api/?number=` + npiNumber + `&version=2.0`;

  request.get(NPIApi, function(err, res, body) {
    const doctorInfo = JSON.parse(res.body);
    response.json({ status: true, doctorInfo });
  });
}

//API Call to NPI Database without response as parameter
function getNPIWithNumber(npiNumber) {
  const NPIApi =
    `https://npiregistry.cms.hhs.gov/api/?number=` + npiNumber + `&version=2.0`;

  request.get(NPIApi, function(err, res, body) {
    const doctorInfo = JSON.parse(res.body);
    console.log(doctorInfo);
    return doctorInfo;
  });
}

//Endpoint to fetch the info through a NPI Number
function getNpiInfo(req, res) {
  console.log(req.params.npi);
  if (req.params.npi) {
    getNPI(req.params.npi, res);
  } else {
    res.json({ status: false, error: "Please enter a NPI Number" });
  }
}

//Functiont to list all the doctors
function getAllDoctors(req, res) {
  Practise.find()
    .populate("taxonomies")
    .populate("address")
    .then(data => res.json({ status: true, data }))
    .catch(error => res.json({ status: false, error }));
}

//Sign up new doctor through API
signUpDoc = (req, res) => {
  let addressArray = [];
  if (req.body.addresses) {
    req.body.addresses.map(el => {
      let address = new Address({
        country_code: el.country_code,
        country_name: el.country_name,
        address_purpose: el.address_purpose,
        address_type: el.address_type,
        address_1: el.address_1,
        address_2: el.address_2,
        city: el.city,
        state: el.state,
        postal_code: el.postal_code,
        telephone_number: el.telephone_number
      });
      address.save().catch(console.log);
      addressArray.push(address._id);
    });
  }

  let practiceLocationsArray = [];
  if (req.body.practiceLocations) {
    req.body.practiceLocations.map(el => {
      let address = new Address({
        country_code: el.country_code,
        country_name: el.country_name,
        address_purpose: el.address_purpose,
        address_type: el.address_type,
        address_1: el.address_1,
        address_2: el.address_2,
        city: el.city,
        state: el.state,
        postal_code: el.postal_code,
        telephone_number: el.telephone_number
      });
      address.save().catch(console.log);
      practiceLocationsArray.push(address._id);
    });
  }

  let taxonomiesArray = [];
  if (req.body.taxonomies) {
    req.body.taxonomies.map(el => {
      let taxonomies = new Taxonomy({
        code: el.code,
        desc: el.desc,
        primary: el.primary,
        state: el.state,
        licence: el.licence,
        taxonomy_group: el.taxonomy_group
      });
      taxonomies.save().catch(console.log);
      taxonomiesArray.push(taxonomies._id);
    });
  }

  let basic = {};
  let doctorInfoBasic = req.body.basic;
  basic.organization_name = doctorInfoBasic.organization_name
    ? doctorInfoBasic.organization_name
    : "not found";
  basic.organizational_subpart = doctorInfoBasic.organizational_subpart
    ? doctorInfoBasic.organizational_subpart
    : "not found";
  basic.enumeration_date = doctorInfoBasic.enumeration_date
    ? doctorInfoBasic.enumeration_date
    : "not found";
  basic.last_updated = doctorInfoBasic.last_updated
    ? doctorInfoBasic.last_updated
    : "not found";
  basic.status = doctorInfoBasic.status ? doctorInfoBasic.status : "not found";
  basic.credential = doctorInfoBasic.authorized_official_credential
    ? doctorInfoBasic.authorized_official_credential
    : doctorInfoBasic.credential;
  basic.first_name = doctorInfoBasic.authorized_official_first_name
    ? doctorInfoBasic.authorized_official_first_name
    : doctorInfoBasic.first_name;
  basic.last_name = doctorInfoBasic.authorized_official_last_name
    ? doctorInfoBasic.authorized_official_last_name
    : doctorInfoBasic.last_name;
  basic.middle_name = doctorInfoBasic.authorized_official_middle_name
    ? doctorInfoBasic.authorized_official_middle_name
    : doctorInfoBasic.middle_name;
  basic.telephone_number = doctorInfoBasic.authorized_official_telephone_number
    ? doctorInfoBasic.authorized_official_telephone_number
    : "not found";
  basic.title_or_position = doctorInfoBasic.authorized_official_title_or_position
    ? doctorInfoBasic.authorized_official_title_or_position
    : "not found";
  basic.name_prefix = doctorInfoBasic.name_prefix
    ? doctorInfoBasic.name_prefix
    : "not found";
  basic.name_suffix = doctorInfoBasic.name_suffix
    ? doctorInfoBasic.name_suffix
    : "not found";
  basic.sole_proprietor = doctorInfoBasic.sole_proprietor
    ? doctorInfoBasic.sole_proprietor
    : "not found";
  basic.gender = doctorInfoBasic.gender ? doctorInfoBasic.gender : "not found";
  basic.name = doctorInfoBasic.name ? doctorInfoBasic.name : "not found";

  setTimeout(function() {
    let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
    var encrypted =
      cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex");
    console.log(encrypted);
    let practise = new Practise({
      enumerationType: req.body.enumeration_type,
      npi: req.body.number,
      last_updated_epoch: req.body.last_updated_epoch,
      created_epoch: req.body.created_epoch,
      basic,
      other_names: req.body.other_names,
      address: addressArray,
      taxonomies: taxonomiesArray,
      practiceLocation: practiceLocationsArray,
      identifiers: req.body.identifiers,
      email: req.body.email,
      password: encrypted,
      steps: [0, 0, 0, 0, 0],
      specialty: req.body.specialty,
      phone: req.body.phone
    });

    //Saving the Doctor Info
    practise.save(function(err, doc) {
      if (err) {
        console.log({ err });
        if (err.name === "MongoError" && err.code === 11000) {
          console.log("This Doctor already exists");
          res.json({
            status: false,
            message: "Doctor with this Npi number already exists"
          });
        }
      } else {
        res.json({
          status: true,
          message: "Successfully Registered",
          data: doc
        });
      }

      // let mailOptions = {
      //   from: '"DocMz"; <admin@docmz.com>',
      //   to: req.body.email,
      //   subject: "Successfully Registered - DocMz",
      //   text: "You've been succesfully registered as a Doctor on DocMz. "
      // };

      // smtpTransport.sendMail(mailOptions, function(err) {
      //   if (err) console.log(err);
      // });
    });
  }, 3000);
};

// Function to authenticate an user
let authenticateDoctor = (req, res) => {
  if (req.body.email) {
    {
      let { email, password } = req.body;
      let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
      let encrypted =
        cipher.update(password, "utf8", "hex") + cipher.final("hex");
      Practise.findOne({ email }).then(doctor => {
        app.get(sessionChecker, (req, res) => {
          console.log({ status: "session stored" });
        });

        //Checking if User exits or not
        if (doctor) {
          console.log(encrypted);
          console.log(doctor);
          if (!doctor) {
            res.status(404).json({ status: false, message: "User Not Found!" });
          } else if (encrypted != doctor.password) {
            res.json({ status: false, error: "Password Entered is Incorrect" });
          } else {
            if (doctor) {
              console.log(Jwt.secret);
              let token = jwt.sign(doctor.toJSON(), "catchmeifyoucan", {
                expiresIn: 604800
              });

              req.session.user = doctor;
              req.session.Auth = doctor;
              res.status(200).json({
                status: true,
                user: req.session.Auth,
                token: "JWT-" + token
              });
            }
          }
        }
      });
    }
  }
};

// // middleware function to check for logged in users
let sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/");
  } else {
    next();
  }
};

//Update profile details
let profileUpdate = (req, res) => {
  let { id } = req.body;
  if (req.body.id) {
    Practise.findByIdAndUpdate(id, req.body, { new: true })
      .then(doctor => {
        res.json({
          status: true,
          message: "Profile successfully updated",
          data: doctor
        });
      })
      .catch(error => {
        res.json({ status: false, message: error });
      });
  }
};

//Exporting all the functions
module.exports = {
  getNpiInfo,
  addDoctors,
  getAllDoctors,
  signUpDoc,
  authenticateDoctor,
  profileUpdate
};
