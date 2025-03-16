import React from "react";
import { useState } from "react";
import axios from "axios";

export default function CreateQuestionnaire() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "text", choices: [] }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addChoice = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.push("");
    setQuestions(updatedQuestions);
  };

  const updateChoice = (qIndex, cIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].choices[cIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/questionnaires", {
        name,
        description,
        questions,
      })
      .then(() => alert("Quiz created!"));
  };

  return (
    <div>
      <h1>Create Quiz</h1>
      <input
        type="text"
        placeholder="Quiz name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {questions.map((q, qIndex) => (
        <div key={qIndex}>
          <input
            type="text"
            placeholder="Question"
            value={q.text}
            onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
          />
          <select
            value={q.type}
            onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="single">Single choice</option>
            <option value="multiple">Multiple choice</option>
          </select>
          {q.type !== "text" && (
            <div>
              {q.choices.map((c, cIndex) => (
                <input
                  key={cIndex}
                  type="text"
                  placeholder="Choice"
                  value={c}
                  onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                />
              ))}
              <button onClick={() => addChoice(qIndex)}>Add choice</button>
            </div>
          )}
        </div>
      ))}
      <button onClick={addQuestion}>Add question</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
