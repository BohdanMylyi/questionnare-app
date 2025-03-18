const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    questionnaireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questionnaire",
      required: true,
    },
    answers: { type: Object, required: true },
    timeTaken: { type: Number, required: true },
    submittedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
