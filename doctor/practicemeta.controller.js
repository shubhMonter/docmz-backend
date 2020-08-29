const db = require("_helpers/db"),
  mongoose = require("mongoose");
const { Router } = require("express");
const { Review, practiceMeta } = require("../_helpers/db");

const addrecentpatient = async (req, res) => {
  try {
    const { id, patientid } = req.body;

    const practice = await Practise.findOne({ _id: id });

    if (practice.meta) {
      const meta = await practiceMeta.findOne({ _id: practice.meta });
      if (meta) {
        const index = meta.recentPatients
          .map(x => {
            return x.patient;
          })
          .indexOf(patientid);
        if (index >= 0) {
          meta.recentPatients.splice(index, 1);
        }
        meta.recentPatients.push({ patient: patientid, createdAt: Date.now() });
        meta.save(function(error) {
          if (error) console.log(error);
          return res
            .status(200)
            .json({ status: true, message: "patient added to list" });
        });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "doctor meta not found!" });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "doctor not Found!" });
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

const addReview = async (req, res) => {
  try {
    const { doctorid, patientid, appointmentid, rating, note } = req.body;
    const review = new Review({ doctorid, patientid, rating, note });
    review.save(async function(error) {
      if (error)
        return res
          .status(400)
          .json({
            status: false,
            message: "somthing went wrong!",
            error: { error }
          });
      const meta = await practiceMeta.findOne({ practiceId: doctorid });
      meta.review.push(rewiew._id);
      meta.save(function(error) {
        if (error)
          return res
            .status(400)
            .json({
              status: false,
              message: "somthing went wrong!",
              error: { error }
            });
        return res.status(200).json({ status: true, message: "review added!" });
      });
    });
    //const meta = await practiceMeta.findOne({practiceId:doctorid});
  } catch (error) {
    return res
      .status(400)
      .json({
        status: false,
        message: "somthing went wrong!",
        error: { error }
      });
  }
};
module.exports = {
  addrecentpatient,
  recentpatients
};
