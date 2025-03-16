import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuestionnaireCatalog from "./pages/QuestionnaireCatalog";
import CreateQuestionnaire from "./pages/CreateQuestionnare";
import "./index.css";
import InteractiveQuestionnaire from "./pages/InteractiveQuestionnare";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionnaireCatalog />} />
        <Route path="/create" element={<CreateQuestionnaire />} />
        <Route path="/quiz/:id" element={<InteractiveQuestionnaire />} />
      </Routes>
    </Router>
  );
}

export default App;
