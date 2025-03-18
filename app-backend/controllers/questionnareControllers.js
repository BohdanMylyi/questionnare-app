const Questionnaire = require("../models/Questionnaire");

exports.getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionnaireById = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) return res.status(404).json({ message: "Not found" });
    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestionnaire = async (req, res) => {
  try {
    const { name, description, questions } = req.body;
    const newQuestionnaire = new Questionnaire({
      name,
      description,
      questions,
    });
    await newQuestionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestionnaire = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updatedQuestionnaire)
      return res.status(404).json({ message: "Not found" });
    res.json(updatedQuestionnaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestionnaire = async (req, res) => {
  try {
    const deletedQuestionnaire = await Questionnaire.findByIdAndDelete(
      req.params.id
    );
    if (!deletedQuestionnaire)
      return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitAnswers = async (req, res) => {
  const { questionnaireId, answers, timeTaken } = req.body;
  try {
    const response = await ResponseModel.create({
      questionnaireId,
      answers,
      timeTaken,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error saving responses" });
  }
};

exports.updateOrder = async (req, res) => {
  const { order } = req.body;

  if (!order || order.length === 0) {
    return res.status(400).json({ message: "Order is required" });
  }

  try {
    for (let i = 0; i < order.length; i++) {
      const questionnaireId = order[i];
      const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(
        questionnaireId,
        { order: i },
        { new: true }
      );
      if (!updatedQuestionnaire) {
        return res
          .status(404)
          .json({
            message: `Questionnaire with id ${questionnaireId} not found`,
          });
      }
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order" });
  }
};
