const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnareControllers");

router.get("/", questionnaireController.getAllQuestionnaires);
router.get("/:id", questionnaireController.getQuestionnaireById);
router.post("/", questionnaireController.createQuestionnaire);
router.put("/:id", questionnaireController.updateQuestionnaire);
router.delete("/:id", questionnaireController.deleteQuestionnaire);

module.exports = router;
