import { useEffect, useState } from "react";
import axios from "axios";

export default function QuestionnaireCatalog() {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/questionnaires")
            .then(res => setQuestionnaires(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Quiz Catalog</h1>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {questionnaires.map((q) => (
                    <div key={q._id} style={{ border: "1px solid black", padding: "10px", width: "200px" }}>
                        <h3>{q.name}</h3>
                        <p>{q.description}</p>
                        <p>Questions: {q.questions.length}</p>
                        <button onClick={() => axios.delete(`http://localhost:5000/api/questionnaires/${q._id}`).then(() => setQuestionnaires(questionnaires.filter(item => item._id !== q._id)))}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
