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
    console.log("Submitting questionnaire:", questions);
    axios
      .post("http://localhost:5000/api/questionnaires", {
        name,
        description,
        questions,
      })
      .then(() => alert("Quiz created!"));
  };

  return (
    <>
      <div className="flex flex-row justify-between m-4">
        <h1 className="text-xl font-bold">Create Quiz</h1>
      </div>
      <div className="card bg-[#FDFAF6] card-xs shadow-md rounded-xl p-5 border-2 w-[300px] mx-auto mt-20">
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder="Quiz name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-bold bg-[#fff] border-2 w-[200px]"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="font-bold bg-[#fff] border-2 w-[200px]"
          />
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <input
                type="text"
                placeholder="Question"
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                className="text-xl font-bold bg-[#fff] border-2"
              />
              <select
                value={q.type}
                onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                className="text-xl font-bold bg-[#fff] border-2"
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
                      onChange={(e) =>
                        updateChoice(qIndex, cIndex, e.target.value)
                      }
                    />
                  ))}
                  <button
                    className="border-2 px-5 rounded-xl bg-[#fff]"
                    onClick={() => addChoice(qIndex)}
                  >
                    Add choice
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex flex-row">
            <button
              className="border-2 px-5 rounded-xl bg-[#fff]"
              onClick={addQuestion}
            >
              Add question
            </button>
            <button
              className="border-2 px-5 rounded-xl bg-[#fff]"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
