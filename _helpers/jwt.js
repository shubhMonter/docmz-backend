const expressJwt = require("express-jwt");
const userService = require("../users/user.service");

//Exporting it
module.exports = jwt;

function jwt() {
  const secret = "catchmeifyoucan";
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/doctors/getinfo",
      "/users/register",
      "/users/token",
      { url: /\/doctors\/getinfo\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/users/login",
      "/codes/upload/cpt",
      "/codes/upload/cptindex",
      "/codes/upload/icd10index",
      "/codes/upload/icd10",
      "/codes/upload/diseases",
      "/doctors/upload",
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
      "/stripe/create/card/profile",
      "/stripe/charge/profile",
      "/stripe/create/profile",
      { url: /\/stripe\/list\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/stripe/charge/card"
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
