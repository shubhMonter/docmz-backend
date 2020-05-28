const readXlsxFile = require("read-excel-file/node");
const Practise = require("./doctor/practice.model");
// File path.
readXlsxFile("doclist.xlsx").then(async rows => {
  for await (const data of rows) {
    console.log(data);
    let doc = {
      npi: data[0],
      name: data[2],
      phone: data[3],
      email: data[4],
      payToAddress: data[5],
      picture: ["/doctors/image/image" + data[0] + ".jpeg"]
    };
    let doctor = new Practise(doc);
    let d = await doctor
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
});
