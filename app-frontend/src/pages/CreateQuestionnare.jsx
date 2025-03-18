import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function CreateQuestionnaire() {
  const [questions, setQuestions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const onSubmit = (data) => {
    console.log("Submitting questionnaire:", questions);
    axios
      .post("http://localhost:5000/api/questionnaires", {
        name: data.quizName,
        description: data.description,
        questions,
      })
      .then(() => alert("Quiz created!"));
  };

  return (
    <>
      <div className="flex flex-row justify-between m-4">
        <Link to={"/"}>
          <h1 className="text-xl font-bold">Create Quiz</h1>
        </Link>
      </div>
      <div className="card bg-[#FDFAF6] card-xs shadow-md rounded-xl p-5 border-2 w-[400px] mx-auto mt-20">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold">Name:</h3>
              <input
                type="text"
                placeholder="Quiz name"
                className="font-bold bg-[#fff] border-2 p-2 rounded-xl"
                {...register("quizName", {
                  required: "Name is required!",
                  maxLength: { value: 10, message: "Max length is 10" },
                })}
              />
              {errors.quizName && (
                <p role="alert" className="text-red-600">
                  {errors.quizName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold">Description:</h3>
              <input
                type="text"
                placeholder="Description"
                className="font-bold bg-[#fff] border-2 p-2 rounded-xl"
                {...register("description", {
                  required: "Description is required!",
                  maxLength: { value: 50, message: "Max length is 50" },
                })}
              />
              {errors.description && (
                <p role="alert" className="text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold my-1">Question {qIndex + 1}:</h3>
                  <h3 className="font-bold">Questions:</h3>
                  <input
                    type="text"
                    placeholder="Question"
                    className="font-bold bg-[#fff] border-2 p-1 rounded-sm"
                    {...register(`questions.${qIndex}.text`, {
                      required: "Question is required!",
                    })}
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(qIndex, "text", e.target.value)
                    }
                  />
                  {errors.questions?.[qIndex]?.text && (
                    <p role="error" className="text-red-600">
                      {errors.questions[qIndex].text.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold">Answer:</h3>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(qIndex, "type", e.target.value)
                    }
                    className="font-bold bg-[#fff] border-2 p-1 rounded-sm"
                  >
                    <option value="text">Text</option>
                    <option value="single">Single choice</option>
                    <option value="multiple">Multiple choice</option>
                  </select>
                </div>
                {q.type !== "text" && (
                  <div>
                    {q.choices.map((c, cIndex) => (
                      <div className="flex flex-col my-2" key={cIndex}>
                        <input
                          type="text"
                          placeholder="Choice"
                          value={c}
                          onChange={(e) =>
                            updateChoice(qIndex, cIndex, e.target.value)
                          }
                          className="font-bold bg-[#fff] border-2 p-1 rounded-sm"
                        />
                      </div>
                    ))}
                    <button
                      className="border-2 px-5 rounded-xl bg-[#fff] mx-auto"
                      onClick={() => addChoice(qIndex)}
                      type="button"
                    >
                      Add choice
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-row gap-2">
              <button
                className="border-2 px-5 rounded-xl bg-[#fff]"
                onClick={addQuestion}
                type="button"
              >
                Add question
              </button>
              <button
                type="submit"
                className="border-2 px-5 rounded-xl bg-[#fff]"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
