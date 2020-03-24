const question = require("./question.model");
const questionnaire = require("./questionnaire.model");

const addQuestion = async (req, res) => {
  console.log("I came in here");
  let options = JSON.parse(req.body.option);
  console.log(req.body);
  // let children = JSON.parse(req.body.children);
  let qus = new question({
    title: req.body.title,
    option: options,
    children: []
  });
  console.log(options);
  if (req.body.parentId === undefined) {
    qus
      .save()
      .then(() => {
        let data = new questionnaire({
          author: "aman",
          title: "something",
          question: qus._id
        });
        data
          .save()
          .then(() => {
            res.json({
              message: "question saved successfully",
              code: 0
            });
          })
          .catch(err => {
            res.json({
              message: err,
              code: 1
            });
          });
      })
      .catch(err => {
        res.json({
          message: err,
          code: 1
        });
      });
  } else {
    qus
      .save()
      .then(() => {
        question
          .findOneAndUpdate(
            { _id: req.body.parentId, "option.text": req.body.optionText },
            {
              $set: { "option.$.linkedQuestion": qus._id },
              $push: { children: qus._id }
            }
          )
          .then(() => {
            res.json({
              message: "all done succesfully added with link",
              code: 0
            });
          })
          .catch(err => {
            res.json({
              message: err,
              code: 0
            });
          });
      })
      .catch(err => {
        res.json({
          message: err,
          code: 0
        });
      });
  }
  // res.send("I am here in addQuestion");
};

const updateQuestion = (req, res) => {
  question
    .findOneAndUpdate(
      { _id: req.body.id },
      { $set: { title: req.body.title, option: req.body.option } }
    )
    .then(() => {
      res.json({
        message: "question updated successfully",
        code: 0
      });
    })
    .catch(err => {
      res.json({
        message: err,
        code: 1
      });
    });
};

const getQuestion = (req, res) => {
  console.log("getQuestions");
  questionnaire
    .findOne({ author: "aman" })
    .select("question")
    .then(result => {
      console.log(result);
      question
        .findOne({ _id: result.question })
        .populate({
          path: "option.linkedQuestion",
          populate: "option.linkedQuestion"
        })
        .populate({ path: "children", populate: "children" })
        .then(result => {
          res.json({
            message: "Success",
            code: 0,
            data: result
          });
        })
        .catch(err => {
          res.json({
            message: err,
            code: 1
          });
        });
    })
    .catch(err => {
      res.json({
        message: err,
        code: 1
      });
    });
};

module.exports = {
  addQuestion,
  getQuestion,
  updateQuestion
};
