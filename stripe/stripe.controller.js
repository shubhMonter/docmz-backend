const keyPublishable = "pk_test_SVGwjErnIO8bMtXItRF8YkBW";
const keySecret = "	sk_test_hoVy16mRDhxHCoNAOAEJYJ4N00pzRH8xK2";
const StripeModel = require("./stripe.model");
const express = require("express");
const app = express();
const router = express.Router();
const stripe = require("stripe")(keySecret);

//Create a payment method
router.post("/create/card", (req, res) => {
  let { number, exp_month, exp_year, cvc } = req.body;
  stripe.paymentMethods.create(
    {
      type: "card",
      card: {
        number,
        exp_month,
        exp_year,
        cvc
      }
    },
    function(err, token) {
      if (err) {
        res.status(400).json({ status: false, message: err });
      } else {
        res
          .status(200)
          .json({ status: true, message: " Token Generated", data: token });
      }
    }
  );
});

//Create a profile
let createProfile = (req, res) => {
  let { description } = req.body;
  stripe.customers.create(
    {
      description
    },
    function(error, customer) {
      if (error) {
        res.status(400).json({ status: false, message: error });
      } else if (customer) {
        res.status(200).json({
          status: true,
          message: "Customer profile Created",
          data: customer
        });
      }
    }
  );
};

//List all cards
let listCards = (req, res) => {
  let { customer } = req.params;
  console.log(customer);
  stripe.customers.listSources(
    customer,
    {
      limit: 100,
      object: "card"
    },
    function(error, cards) {
      if (error) {
        res.status(400).json({ status: false, message: error });
      } else if (cards) {
        res
          .status(200)
          .json({ status: true, message: "Card list retrieved", data: cards });
      }
    }
  );
};

//Create a card(payment method) and save it in the users object
let createCardProfile = (req, res) => {
  let { number, exp_month, exp_year, cvc, customer, name } = req.body;

  stripe.tokens.create(
    {
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
        name
      }
    },
    function(err, token) {
      if (err) {
        res.status(400).json({ status: false, message: err });
      }
      console.log(token);
      if (token) {
        stripe.customers.createSource(
          customer,
          {
            source: token.id
          },
          function(err, card) {
            if (err) {
              res.status(400).json({ status: false, message: err });
            } else if (card) {
              res.status(200).json({
                status: true,
                message: "Card successfully added",
                data: card
              });
            }
          }
        );
      }
    }
  );
};

//charge a card from a payment profile
let profileCharge = (req, res) => {
  let { amount, source, customer, description } = req.body;
  stripe.charges.create(
    {
      amount,
      currency: "usd",
      source,
      customer,
      description
    },
    function(err, charge) {
      if (err) {
        res.status(404).json({ status: false, error: err });
      } else if (charge) {
        res
          .status(200)
          .json({ status: true, message: "Charge Created", data: charge });
      }
    }
  );
};

//

//Charge a payment method
router.post("/token/find", function(req, res) {
  let query = req.body.token;
  stripe.tokens.retrieve(query, function(err, token) {
    if (err) {
      res.status(404).json({ status: false, error: err });
    } else {
      res.status(200).json({ status: true, details: token });
    }
  });
});

router.post("/token/create", function(req, res) {
  stripe.tokens.create(
    {
      card: {
        number: req.body.cardnumber,
        exp_month: req.body.expmonth,
        exp_year: req.body.expyear,
        cvc: req.body.cvc
      }
    },
    function(err, token) {
      if (err) {
        res.status(404).json({ status: false, error: err });
      } else {
        console.log(token);
        let stripe = new Stripeuser();
        if (req.body.userid) {
          stripe.userid = req.body.userid;
        }
        stripe.token = token;
        if (req.body.userdetails) {
          stripe.userdetails = req.body.userdetails;
        }
        stripe
          .save()
          .then(data =>
            res.status(200).json({ status: true, token: token, details: data })
          )
          .catch(err => res.json({ status: false, error: err }));
      }
    }
  );
});

router.post("/charge", function(req, res) {
  let amount = req.body.amount;

  // create a customer
  stripe.customers
    .create({
      email: req.body.stripeemail,
      source: req.body.stripetoken
    })
    .then(customer => savedata(customer))
    .catch(err => res.json({ status: false, error: err }));
  // .then((charge) => res.json({ status: true, details: charge }));

  async function savedata(customer) {
    stripe.charges
      .create({
        amount,
        description: req.body.description,
        currency: "usd",
        customer: customer.id
      })
      .then(data => saveData(data));

    async function saveData(data) {
      await Stripeuser.findOneAndUpdate(
        { userid: req.body.userid },
        { $set: { customerid: customer.id, stripedetails: data } }
      ).then(() => res.json({ status: true, details: data }));
    }
  }
});

module.exports = {
  createCardProfile,
  profileCharge,
  createProfile,
  listCards
};
