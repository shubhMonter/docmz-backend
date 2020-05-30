const readXlsxFile = require("read-excel-file/node");
const Practise = require("./doctor/practice.model");
const faker = require("faker");
const fs = require("fs");

const path = require("path");
const availability = require("./doctor/availability.controller");
// const fs = require('fs');
//joining path of directory
// const directoryPath = path.join(__dirname, 'Documents');
//passsing directoryPath and callback function
// fs.readdir("/home/dev-aman7/Desktop/xl/media", function(err, files) {
// 	//handling error
// 	if (err) {
// 		return console.log("Unable to scan directory: " + err);
// 	}
// 	//listing all files using forEach
// 	files.forEach(function(file) {
// 		// Do whatever you want to do with the file
// 		console.log(file);
// 	});
// });

// console.log(__filename);
// fs.readFile("/home/dev-aman7/Desktop/xl/media/image1.jpeg", function(
// 	err,
// 	data
// ) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		var newPath = __dirname + "/public/image123.jpeg";
// 		fs.writeFile(newPath, data, function(err) {
// 			console.log(err);
// 		});
// 	}
// 	console.log(data);
// });
// File path.
readXlsxFile("doclist.xlsx").then(async rows => {
  console.log(rows);
  for await (const data of rows) {
    if (data[0] === null) {
      continue;
    } else {
      let d1 = await fs.readFile(
        "/home/dev-aman7/Desktop/xl/media/image" + data[0] + ".jpeg",
        async function(err, file) {
          if (err) {
            console.log(err);
          } else {
            let imageName = "image" + Date.now() + ".jpeg";
            var newPath = __dirname + "/public/doctors/image/" + imageName;
            let d2 = await fs.writeFile(newPath, file, async function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log(data);
                let doc = {
                  npi: faker.random.number(),
                  name: data[2],
                  phone: data[3],
                  email: data[4],
                  payToAddress: data[5],
                  picture: ["/doctors/image/image" + data[0] + ".jpeg"],
                  city: faker.address.city()
                };

                let doctor = new Practise(doc);
                let d = await doctor
                  .save()
                  .then(result => {
                    availability.getTimeSlots(result._id);
                    console.log(result);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });
          }
        }
      );
    }
  }
});
