const db = require("_helpers/db"),
  express = require("express"),
  app = express();
(csvParser = require("csv-parse")),
  (Practise = db.Practise),
  (Taxonomy = db.Taxonomy),
  (Address = db.Address),
  (Appointment = db.Appointment),
  (Specialty = db.Specialty),
  (Patient = db.User),
  (Payment = db.Payment),
  (crypto = require("crypto")),
  (algorithm = "aes-256-cbc");

let key = "abcdefghijklmnopqrstuvwxyztgbhgf";
let iv = "1234567891234567";
let Jwt = require("../_helpers/jwt");
var jwt = require("jsonwebtoken");
const keySecret = "	sk_test_hoVy16mRDhxHCoNAOAEJYJ4N00pzRH8xK2";

const fs = require("fs");

//Only admin
registerByAdmin = async (req, res) => {
  console.log(req.body);
  let addressArray = [];

  let address = new Address({
    country_name: req.body.country,
    address_1: req.body.address,
    city: req.body.city,
    state: req.body.state,
    postal_code: req.body.zip,
    telephone_number: req.body.phone
  });
  address
    .save()
    .then(() => {
      addressArray.push(address._id);
      let doctor = new Practise({
        ...req.body,
        address: addressArray,
        npi: req.body.registration_number
      });
      doctor
        .save()
        .then(() =>
          res
            .status(200)
            .json({ status: true, message: "Succesfuuly registered doctor" })
        )
        .catch(err =>
          res.status(500).json({
            status: false,
            message: err
          })
        );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err,
        status: false
      });
    });
};

addDoctorsByAdmin = async file => {
  let fileReceived = await fs.readFileSync(file, {
    encoding: "utf-8"
  });
  console.log("file", fileReceived);
  let data = await csvParser(fileReceived, {
    delimiter: ","
  });
  console.log("data", data);
  let i = 0;
  let errorLogs = [];
  for await (const elem of data) {
    // console.log(elem, i++);
    let addressArray = [];

    let address = new Address({
      address_1: elem[6],
      city: elem[7],
      state: elem[8],
      country_name: elem[9],
      postal_code: elem[10],
      telephone_number: elem[4]
    });
    let d = await address
      .save()
      .then(() => {
        addressArray.push(address._id);
        let doctor = new Practise({
          first_name: elem[0],
          last_name: elem[1],
          npi: elem[2],
          specialty: elem[3],
          telephone_number: elem[4],
          city: elem[7],
          state: elem[8],
          country_name: elem[9],
          address: addressArray
        });
        doctor
          .save()
          .then(doc => {
            // console.log(doc);
          })
          .catch(err => {
            // console.log(err);
            errorLogs.push({ err, index: i });
          });
      })
      .catch(err => {
        // console.log("address didnot save", err);
        errorLogs.push({ err, index: i });
      });
    console.log(i++);
  }
  return Promise.resolve(errorLogs);
};

getSpecialty = (req, res) => {
  Specialty.find({})
    .then(result => {
      res.status(200).json({
        status: true,
        message: "Successfully fetched specialities",
        data: result
      });
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        message: err
      });
    });
};
addSpecialty = (req, res) => {
  let data = new Specialty(req.body);
  data
    .save()
    .then(result => {
      res.status(200).json({
        status: true,
        message: "Added succesfully",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      if (err.name) {
        res.status(400).send({
          message: "I got some error",
          status: false
        });
      } else
        res.status(500).json({
          message: err,
          status: false
        });
    });
};

let searchDocsLite = (req, res) => {
  // console.log(address.collection.name);
  console.log(req.body);
  let options = { ...JSON.parse(req.body.match) };
  console.log("options;", { ...options });
  let page = req.body.pageNo || 0;
  let size = req.body.size || 10;
  console.log(req.body.name);
  let name = "";
  if (req.body.name) {
    let exp = req.body.name;
    name = new RegExp(exp);
    console.log("here name", name);
  }
  let h = "abc";
  console.log(new RegExp(h));
  // console.log("name", name, options);
  // console.log("name", name);
  // let name = 7;
  Practise.aggregate([
    {
      $match: {
        ...options,
        "basic.name": { $regex: new RegExp(req.body.name), $options: "i" }
      }
    },
    {
      $project: {
        picture: 1,
        profileStatus: 1,
        basic: 1,
        npi: 1,
        specialty: 1,
        experience: 1,
        specialtyName: 1,
        rating: 1,
        fee: 1,
        description: 1,
        phone: 1,
        is_superDoc: 1,
        appointments: 1
      }
    },
    {
      $lookup: {
        from: Appointment.collection.name,
        localField: "appointments",
        foreignField: "_id",
        as: "output"
      }
    },
    { $match: { "output.booked": false } },
    // { $slice: ["$output", 3] },
    // { $match: { output: { $exists: true, $not: { $size: 0 } } } },
    {
      $project: {
        appointments: 0
        // next: { $slice: ["$output", 3] },
      }
    }
  ])
    .skip(size * page)
    .limit(size)
    .then(data => {
      res.status(200).json({
        status: true,
        message: "successfully fetched data",
        data: data
      });
    })
    .catch(err =>
      res.status(500).json({
        status: false,
        message: err
      })
    );
};
updateSpecialty = (req, res) => {
  Specialty.findOneAndUpdate({ _id: req.body._id }, req.body)
    .then(result =>
      res.status(200).json({ status: true, message: "Updated Successfully" })
    )
    .catch(err => {
      res.status(500).json({ message: err, status: false });
    });
};

getPatient = (req, res) => {
  Patient.find({})
    .then(result => {
      res.status(200).json({
        status: true,
        message: "Successfully fetched patients",
        data: result
      });
    })
    .catch(err => res.status(500).json({ status: false, message: err }));
};
addPatient = (req, res) => {
  console.log(req.body);
  let data = new Patient(req.body);
  data
    .save()
    .then(result => {
      res
        .status(200)
        .json({ message: "Successfully added Patient", status: true });
    })
    .catch(err => res.status(500).json({ status: false, message: err }));
};
updatePatient = (req, res) => {
  Patient.findOneAndUpdate({ _id: req.body._id }, req.body, {
    new: true
  })
    .then(result => {
      res.status(200).json({
        status: true,
        message: "Successfully fetched patients",
        data: result
      });
    })
    .catch(err => res.status(500).json({ status: false, message: err }));
};

getPayment = (req, res) => {
  Payment.find({})
    .populate("patient")
    .populate("doctor")
    .then(result => {
      res.status(200).json({
        status: true,
        message: "Successfully fetched  payments",
        data: result
      });
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        message: err
      });
    });
};

addPayment = (req, res) => {
  let data = new Payment(req.body);
  data
    .save()
    .then(result => {
      res.status(200).json({
        status: true,
        message: "Successfully added payment",
        data: result
      });
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        message: err
      });
    });
};
module.exports = {
  addPatient,
  updatePatient,
  getPatient,
  updateSpecialty,
  registerByAdmin,
  addDoctorsByAdmin,
  addSpecialty,
  getSpecialty,
  searchDocsLite,
  getPayment,
  addPayment
};
