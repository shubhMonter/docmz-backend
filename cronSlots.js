let { Scheduler } = require("@ssense/sscheduler");

const scheduler = new Scheduler();
const availability = scheduler.getAvailability({
  from: "2017-02-01",
  to: "2017-02-02",
  duration: 60,
  interval: 60,
  schedule: {
    weekdays: {
      from: "09:00",
      to: "17:00",
      unavailability: [{ from: "12:00", to: "13:00" }]
    }
    // unavailability: [
    // 	// two different types of unavailability structure
    // 	{ from: "2017-02-20 00:00", to: "2017-02-27 00:00" },
    // 	{ date: "2017-02-15", from: "12:00", to: "13:00" }
    // ],
    // allocated: [
    // 	{ from: "2017-02-01 13:00", duration: 60 },
    // 	{ from: "2017-02-01 14:00", duration: 60 }
    // ]
  }
});

console.log(availability);
