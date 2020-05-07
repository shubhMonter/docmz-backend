const db = require("../_helpers/db");
const Usermeta = db.Usermeta,
  Appointment = db.Appointment,
  Medicine = db.Medicine;

const addMedicine = (req, res) => {
  let { appointmentId, practiseId, metaId, medicines } = req.body;
  if (typeof medicines === "string") {
    medicines = JSON.parse(medicines);
  }
  const data = {
    appointment: appointmentId,
    practise: practiseId,
    medicines: medicines
  };
  let medicineData = new Medicine(data);
  medicineData.save().then(async result => {
    console.log(result);
    let d1 = Usermeta.findOneAndUpdate(
      { _id: metaId },
      { $push: { medicines: result._id } },
      { new: true }
    );
    let d2 = Appointment.findOneAndUpdate(
      { _id: appointmentId },
      { medicines: result._id },
      { new: true }
    );
    Promise.all([d1, d2])
      .then(result => {
        console.log(result);
        res.status(200).json({
          status: true,
          message: "Successfully added medicines"
        });
      })
      .catch(err => {
        res.status(500).json({
          status: false,
          message: "Something went wrong",
          err: err
        });
      });
  });
};

module.exports = {
  addMedicine
};
