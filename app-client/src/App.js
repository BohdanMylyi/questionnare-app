import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuestionnaireCatalog from "./pages/QuestionnaireCatalog";
import CreateQuestionnaire from "./pages/CreateQuestionnaire";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionnaireCatalog />} />
        <Route path="/create" element={<CreateQuestionnaire />} />
      </Routes>
    </Router>
  );
}

export default App;
