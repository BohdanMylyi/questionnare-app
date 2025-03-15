const express = require("express");
const router = express.Router();
const Questionnaire = require("../models/Questionnaire");

router.get("/", async (req, res) => {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
});

router.post("/", async (req, res) => {
    const newQuestionnaire = new Questionnaire(req.body);
    await newQuestionnaire.save();
    res.status(201).json(newQuestionnaire);
});

router.delete("/:id", async (req, res) => {
    await Questionnaire.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;
