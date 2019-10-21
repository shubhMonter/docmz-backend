const db = require("_helpers/db"),
  express = require("express"),
  app = express(),
  request = require("request");
(csvParser = require("csv-parse")), (fs = require("fs"));
(Practise = db.Practise), (Taxonomy = db.Taxonomy), (Address = db.Address);

let filePathForDoctors = "./doctor/doctors.csv";

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

                  basic = {};
                  let doctorInfoBasic = doctorInfo.basic;
                  (basic.organization_name = doctorInfoBasic.organization_name
                    ? doctorInfoBasic.organization_name
                    : "not found"),
                    (basic.organizational_subpart = doctorInfoBasic.organizational_subpart
                      ? doctorInfoBasic.organizational_subpart
                      : "not found"),
                    (basic.enumeration_date = doctorInfoBasic.enumeration_date
                      ? doctorInfoBasic.enumeration_date
                      : "not found"),
                    (basic.last_updated = doctorInfoBasic.last_updated
                      ? doctorInfoBasic.last_updated
                      : "not found"),
                    (basic.status = doctorInfoBasic.status
                      ? doctorInfoBasic.status
                      : "not found"),
                    (basic.credential = doctorInfoBasic.authorized_official_credential
                      ? doctorInfoBasic.authorized_official_credential
                      : doctorInfoBasic.credential),
                    (basic.first_name = doctorInfoBasic.authorized_official_first_name
                      ? doctorInfoBasic.authorized_official_first_name
                      : doctorInfoBasic.first_name),
                    (basic.last_name = doctorInfoBasic.authorized_official_last_name
                      ? doctorInfoBasic.authorized_official_last_name
                      : doctorInfoBasic.last_name),
                    (basic.middle_name = doctorInfoBasic.authorized_official_middle_name
                      ? doctorInfoBasic.authorized_official_middle_name
                      : doctorInfoBasic.middle_name),
                    (basic.telephone_number = doctorInfoBasic.authorized_official_telephone_number
                      ? doctorInfoBasic.authorized_official_telephone_number
                      : "not found"),
                    (basic.title_or_position = doctorInfoBasic.authorized_official_title_or_position
                      ? doctorInfoBasic.authorized_official_title_or_position
                      : "not found"),
                    (basic.name_prefix = doctorInfoBasic.name_prefix
                      ? doctorInfoBasic.name_prefix
                      : "not found"),
                    (basic.name_suffix = doctorInfoBasic.name_suffix
                      ? doctorInfoBasic.name_suffix
                      : "not found"),
                    (basic.sole_proprietor = doctorInfoBasic.sole_proprietor
                      ? doctorInfoBasic.sole_proprietor
                      : "not found"),
                    (basic.gender = doctorInfoBasic.gender
                      ? doctorInfoBasic.gender
                      : "not found"),
                    (basic.name = doctorInfoBasic.name
                      ? doctorInfoBasic.name
                      : "not found");

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
  let practise = new Practise(req.body);
  practise
    .save()
    .then(doc => {
      res.json({ status: true, doc });
    })
    .catch(error => {
      res.status(200).json({ status: false, error });
    });
};

//Exporting all the functions
module.exports = {
  getNpiInfo,
  addDoctors,
  getAllDoctors,
  signUpDoc
};
