const expressJwt = require("express-jwt");
const userService = require("../users/user.service");

//Exporting it
module.exports = jwt;

function jwt() {
  const secret = "catchmeifyoucan";
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/patient/specialty/get",
      "/doctors/appointment/date",
      "/team/update",
      "/team/add",
      "/questionnaire/delete/root",
      "/doctors/appointment/next",
      "/doctors/getdoc",
      "/patient/meta/get",
      "/patient/test/update",
      "/patient/test/get",
      "/patient/test/add",
      "/patient/member/add",
      "/patient/member/delete",
      "/patient/member/update",
      "/patient/member/get",
      "/patient/add/identity",
      "/referral/add",
      "/patient/getinfo/:id",
      "/medicine/add",
      "/medicine/addbypatient",
      { url: /\/medicine\/get\/([^\/]*)$/, methods: ["GET"] },
      "/medicine/delete",
      "/patient/medicalInfo/add",
      "/patient/favourite/remove",
      "/patient/favourite/add",
      "/patient/addrecentdoctor",
      { url: /\/patient\/recentdoctors\/([^\/]*)$/, methods: ["GET"] },
      "/doctors/upload/image",
      "/doctors/upload/document",
      "/patient/upload/records",
      "/doctors/video",
      "/doctors/addrecentpatient",
      { url: /\/doctors\/recentpatients\/([^\/]*)$/, methods: ["GET"] },
      "/admin/questionnaire/question/add",
      "/admin/questionnaire/question/update",
      "/admin/questionnaire/question/get",
      "/admin/questionnaire/get",
      "/admin/auth/signIn",
      "/admin/auth/signUp",
      "/admin/payment/get",
      "/admin/payment/add",
      "/admin/patient/update",
      "/admin/patient/add",
      "/admin/patient/get",
      "/admin/specialty/update",
      "/admin/specialty/add",
      "/admin/specialty/get",
      "/admin/doctors/searchlite",
      "/admin/doctors/addCSV",
      "/admin/doctors/register",
      "/doctors/searchlite",
      "/patient/picture/delete",
      "/patient/upload/image",
      "/questionnaire/delete",
      "/questionnaire/update",
      "/questionnaire/add",
      "/questionnaire/get",
      "/doctors/getinfo",
      "/patient/attempt",
      "/patient/register",
      "/patient/authenticate",
      "/patient/update",
      "/doctors/setpassword",
      "/doctors/forgetpassword",
      "/patient/forgetpassword",
      "/patient/setpassword",
      { url: /\/patient\/getinfo\/([^\/]*)$/, methods: ["GET", "POST"] },
      { url: /\/patient\/getfullinfo\/([^\/]*)$/, methods: ["GET"] },
      "/users/token",
      { url: /\/doctors\/getinfo\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/users/login",
      "/codes/upload/cpt",
      "/codes/upload/cptindex",
      "/codes/upload/icd10index",
      "/codes/upload/icd10",
      "/codes/upload/diseases",
      "/doctors/upload",
      "/doctors/search",
      "/codes/get/diseases",
      "/doctors/get",
      "/insurance/addtodatabase/carriers",
      "/insurance/get/carriers",
      "/insurance/delete/carriers",
      "/doctors/upload/procedures",
      "/doctors/get/procedures",
      "/doctors/upload/specialties",
      "/doctors/get/specialties",
      "/doctors/register",
      "/doctors/authenticate",
      "/doctors/profile/update",
      "/doctors/saveslots",
      "/doctors/picture/delete",
      "/stripe/create/card/profile",
      "/stripe/charge/profile",
      "/stripe/create/profile",
      { url: /\/stripe\/list\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/stripe/charge/card",
      "/stripe/testcard",
      "/appointment/book",
      "/appointment/cancel",
      "/appointment/get",
      "/appointment/approve",
      { url: /\/getdoc\/([^\/]*)$/, methods: ["GET", "POST"] },
      { url: /\/doctors\/upload\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/patient/familyhistory/add",
      { url: /\/patient\/familyhistory\/get\/([^\/]*)$/, methods: ["GET"] },
      "/patient/surgeries/add",
      { url: /\/patient\/surgeries\/get\/([^\/]*)$/, methods: ["GET"] },
      "/patient/reports/add",
      { url: /\/patient\/reports\/get\/([^\/]*)$/, methods: ["GET"] },
      "/payment/add",
      "/razorpay/createorder",
      "/otp/create",
      "/otp/verify",
      "/clinic/add",
      "/clinic/edit",
      { url: /\/clinic\/getclinic\/([^\/]*)$/, methods: ["GET"] },
      "/clinic/getallclinic",
      { url: /\/clinic\/bydoctor\/([^\/]*)$/, methods: ["GET"] },
      "/doctors/toggleblock"
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }
  done();
}
