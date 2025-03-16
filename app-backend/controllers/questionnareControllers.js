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
    const { name, description } = req.body;
    const newQuestionnaire = new Questionnaire({
      name,
      description,
      questions: [],
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
