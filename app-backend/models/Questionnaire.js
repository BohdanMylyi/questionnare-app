const mongoose = require("mongoose");

const QuestionnaireSchema = new mongoose.Schema({
  name: String,
  description: String,
  questions: [
    {
      text: String,
      type: { type: String, enum: ["text", "single", "multiple"] },
      choices: [String],
    },
  ],
  completions: { type: Number, default: 0 },
});

module.exports = mongoose.model("Questionnaire", QuestionnaireSchema);
