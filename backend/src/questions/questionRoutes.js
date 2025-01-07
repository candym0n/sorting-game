const express = require('express');
const QuestionStore = require("./QuestionStore");
const router = express.Router();

router.post("/register", QuestionStore.RegisterQuestion.bind(QuestionStore));
router.post("/answer", QuestionStore.AnswerQuestion.bind(QuestionStore));

module.exports = router;
