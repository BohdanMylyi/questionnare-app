const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnareControllers");

router.get("/", questionnaireController.getAllQuestionnaires);
router.get("/:id", questionnaireController.getQuestionnaireById);
router.post("/", questionnaireController.createQuestionnaire);
router.put("/:id", questionnaireController.updateQuestionnaire);
router.delete("/:id", questionnaireController.deleteQuestionnaire);
router.post("/api/quiz-responses", questionnaireController.submitAnswers);
router.put("/update-order", questionnaireController.updateOrder);

module.exports = router;
