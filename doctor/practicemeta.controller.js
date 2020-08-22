const db = require("_helpers/db"),
  mongoose = require("mongoose");
const { Router } = require("express");
(express = require("express")),
  (app = express()),
  (request = require("request"));
(csvParser = require("csv-parse")),
  (Practise = db.Practise),
  (Taxonomy = db.Taxonomy),
  (Address = db.Address),
  (Usermeta = db.Usermeta),
  (Appointment = db.Appointment),
  (Referral = db.Referral),
  (Specialty = db.Specialty),
  (practiceMeta = db.practiceMeta),
  (crypto = require("crypto")),
  (algorithm = "aes-256-cbc");

const addrecentpatient = async (req, res) => {
  try {
    const { id, patientid } = req.body;

    const practice = await Practise.findOne({ _id: id });

    if (practice.meta) {
      const meta = await practiceMeta.findOne({ _id: practice.meta });
      console.log(meta);
      const index = meta.recentPatients
        .map(x => {
          return x.patient;
        })
        .indexOf(patientid);
      if (index >= 0) {
        meta.recentPatients.splice(index, 1);
      }
      meta.recentPatients.push({ patient: patientid });
      meta.save(function(error) {
        if (error) console.log(error);
        return res
          .status(200)
          .json({ status: true, message: "patient added to list" });
      });
    }
  } catch (error) {
    res.send(error);
  }
};

const recentpatients = async (req, res) => {
  try {
    const { id } = req.params;
    const practice = await Practise.findOne({ _id: id });
    if (practice) {
      const meta = await practiceMeta
        .findOne({ _id: practice.meta })
        .populate("recentPatients.patient");
      if (meta) {
        return res
          .status(200)
          .json({ status: true, data: meta.recentPatients });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "doctor meta not found!" });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "doctor not found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
module.exports = {
  addrecentpatient,
  recentpatients
};
