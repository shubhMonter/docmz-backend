let { Scheduler } = require("@ssense/sscheduler");
let AppointmentModel = require("../appointments/appointment.model");
let Practise = require("./practice.model");

let moment = require("moment");
// Create time slots for doctor
let getTimeSlots = body => {
  let test = {
    duration: "15",
    customGap: "",
    weekdaysArr: [
      {
        days: ["wednesday", "thursday", "friday"],
        startTime: "2019-11-12T02:30:00.000Z",
        endTime: "2019-11-12T11:30:00.000Z",
        lunchStart: "2019-11-12T06:30:00.000Z",
        lunchEnd: "2019-11-12T07:30:00.000Z"
      },
      {
        days: ["monday", "tuesday"],
        startTime: "2019-11-12T03:30:00.000Z",
        endTime: "2019-11-12T12:30:00.000Z",
        lunchStart: "2019-11-12T06:30:00.000Z",
        lunchEnd: "2019-11-12T07:30:00.000Z"
      }
    ]
  };

  let currentDate = moment().format("MM/DD/YYYY");
  let futureMonth = moment(currentDate).add(1, "M");
  let futureMonthEnd = moment(futureMonth).endOf("month");

  // if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
  //     futureMonth = futureMonth.add(1, 'd');
  // }

  //Current Date
  console.log(currentDate);
  //Future Month
  console.log(futureMonth);

  //Construct Schedule
  let objArray = [];
  test.weekdaysArr.map(el => {
    console.log({ el });
    let obj = {};
    el.days.map(day => {
      console.log({ day });
      obj.from = el.startTime;
      obj.to = el.endTime;
      obj.unavailability = [
        {
          from: el.lunchStart,
          to: el.lunchStart
        }
      ];

      objArray.push({ [day]: obj });
      console.log({ day, obj });
    });
  });

  setTimeout(function() {
    console.log({ objArray });
    objArray.map(el => {
      console.log({ el });
    });

    let payload = {
      from: currentDate,
      to: futureMonth,
      duration: test.duration,
      // "interval": test.customGap,
      id: "5dad6ba6f4ab551864e63f01",
      schedule: objArray
    };
    const scheduler = new Scheduler();
    const availability = scheduler.getAvailability({
      from: currentDate,
      to: futureMonth,
      duration: 30,
      interval: 15,
      schedule: { objArray }
    });
    console.log({ availability });
    return payload;
  }, 3000);

  // {
  //   monday: {
  //     from: '09:00',
  //     to: '17:00',
  //     unavailability: [
  //       { from: '12:00', to: '13:00' }
  //     ]
  //   },
  //   custom_schedule: [
  //     { "date": "2017-01-23", "from": "12:00", "to": "17:00" },
  //   ]
  // }

  //   const availability = scheduler.getAvailability({
  //     from,
  //     to,
  //     duration,
  //     interval,
  //     schedule
  //   });
  //   console.log({availability})

  //   console.log(body);
  //   const scheduler = new Scheduler();
  //   let { from, to, duration, interval, schedule, id } = body;

  //   const availability = scheduler.getAvailability({
  //     from,
  //     to,
  //     duration,
  //     interval,
  //     schedule
  //   });
  //   console.log({availability})
  //   let timeSlotsArray = [];
  //   let availabilityDates = Object.keys(availability).map((key, index) => {
  //     let dash = availability[key]
  //     dash.map(el => {

  //       let timeString = key + " " + el.time + ":00";
  //       console.log({timeString})
  //       const myDate = moment(timeString)
  //     let timeModel = new AppointmentModel({
  //       bookedFor: myDate,
  //       available: el.available,
  //       doctor:id
  //     })

  //     timeModel.save()
  //     console.log({timeModel, myDate, el})
  //     timeSlotsArray.push(timeModel._id);
  //     })

  //   });
  //   let test;
  //   setTimeout(function(){

  //     Practise.findByIdAndUpdate(id, {$set:{appointments: timeSlotsArray }}).then(console.log("Successs"))

  //     Practise.findById(id).then(data => {
  //       test = data
  //     })

  //     console.log({timeSlotsArray})
  //   }
  //     , 3000);
  // //   let RenewDate = availabilityDates.pop();
  // //   console.log({RenewDate});

  // //   var recToRemove={ id: 1, name: 'Siddhu' };

  // // user.splice(user.indexOf(recToRemove),1)

  //   // return availability;
  // return test;
};

module.exports = {
  getTimeSlots
};
