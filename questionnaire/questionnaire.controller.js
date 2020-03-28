const question = require("./question.model");
const practice = require("../doctor/practice.model");

const addQuestion = async (req, res) => {
  console.log("I came in here");
  let options = JSON.parse(req.body.option);
  console.log(req.body);
  // let children = JSON.parse(req.body.children);
  let qus = new question({
    ...req.body,
    option: options,
    superQuestion: req.body.superQuestion || false,
    speciality: req.body.speciality || "NA"
    // title: req.body.title,
    // option: options,
    // speciality: req.body.speciality || "NA",
    // superQuestion: req.body.superQuestion || false,
    // parent: req.body.parent || "",
    // optionText: req.body.optionText || ""
  });
  console.log(options);
  if (req.body.parent === undefined) {
    qus
      .save()
      .then(() => {
        practice
          .findByIdAndUpdate(req.body.id, { $set: { question: qus._id } })
          .then(() => {
            res.status(200).json({
              message: "successfully added question"
            });
          })
          .catch(err => {
            res.status(500).json({
              message: err
            });
          });
        // let data = new questionnaire({
        // 	author: "aman",
        // 	title: "something",
        // 	question: qus._id
        // });
        // data
        // 	.save()
        // 	.then(() => {
        // 		res.json({
        // 			message: "question saved successfully",
        // 			code: 0
        // 		});
        // 	})
        // 	.catch(err => {
        // 		res.json({
        // 			message: err,
        // 			code: 1
        // 		});
        // 	});
      })
      .catch(err => {
        res.status(500).json({
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
            { _id: req.body.parent, "option.text": req.body.optionText },
            {
              $set: { "option.$.linkedQuestion": qus._id }
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

const updateQuestion = async (req, res) => {
  // let d = await question.findOne({ _id: req.body.id });
  // console.log(d);
  // res.send(d);

  question
    .findOneAndUpdate({ _id: req.body.id }, req.body)
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
  practice
    .findOne({ _id: req.body.id })
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

const deleteQuestion = async (req, res) => {
  let d1 = await question.deleteOne({ _id: req.body.id });

  let d2 = await question.findOneAndUpdate(
    { _id: req.body.parent, "option.text": req.body.optionText },
    {
      $unset: { "option.$.linkedQuestion": 1 }
    }
  );

  Promise.all([d1, d2])
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "successfully deleted question"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });

  // question
  // 	.deleteOne({ _id: req.body.id })
  // 	.then(() => {
  // 		res.status(200).json({
  // 			message: "successfully deleted question"
  // 		});
  // 	})
  // 	.catch(err => {
  // 		res.status(500).json({
  // 			message: err
  // 		});
  // 	});
};

module.exports = {
  addQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion
};
