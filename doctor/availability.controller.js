let { Scheduler } = require("@ssense/sscheduler");

// Create time slots for doctor
let getTimeSlots = body => {
  console.log(body);
  const scheduler = new Scheduler();
  let { from, to, duration, interval, schedule } = body;

  const availability = scheduler.getAvailability({
    from,
    to,
    duration,
    interval,
    schedule
  });
  console.log(availability);
};

module.exports = {
  getTimeSlots
};
