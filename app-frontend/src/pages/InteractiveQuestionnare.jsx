import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function InteractiveQuestionnaire() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/questionnaires/${id}`)
      .then((response) => {
        setQuiz(response.data);
        setStartTime(new Date());
      })
      .catch((error) => {
        console.error("Error fetching quiz data", error);
      });
  }, [id]);

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setEndTime(new Date());
    axios
      .post("http://localhost:5000/api/quiz-responses", {
        questionnaireId: id,
        answers,
        timeTaken: (endTime - startTime) / 1000,
      })
      .then(() => alert("Quiz submitted!"))
      .catch((error) => {
        console.error("Error submitting quiz", error);
      });
  };

  const renderQuestion = (question, index) => {
    if (question.type === "text") {
      return (
        <div key={index}>
          <label>{question.text}</label>
          <input
            type="text"
            value={answers[index] || ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </div>
      );
    }

    if (question.type === "single") {
      return (
        <div key={index}>
          <label>{question.text}</label>
          {question.choices.map((choice, cIndex) => (
            <div key={cIndex}>
              <input
                type="radio"
                name={`question-${index}`}
                value={choice}
                checked={answers[index] === choice}
                onChange={() => handleAnswerChange(index, choice)}
              />
              <label>{choice}</label>
            </div>
          ))}
        </div>
      );
    }

    if (question.type === "multiple") {
      return (
        <div key={index}>
          <label>{question.text}</label>
          {question.choices.map((choice, cIndex) => (
            <div key={cIndex}>
              <input
                type="checkbox"
                value={choice}
                checked={answers[index]?.includes(choice)}
                onChange={() => {
                  const newAnswer = answers[index] || [];
                  if (newAnswer.includes(choice)) {
                    setAnswers((prev) => [
                      ...prev.slice(0, index),
                      prev[index].filter((item) => item !== choice),
                      ...prev.slice(index + 1),
                    ]);
                  } else {
                    setAnswers((prev) => [
                      ...prev.slice(0, index),
                      [...(prev[index] || []), choice],
                      ...prev.slice(index + 1),
                    ]);
                  }
                }}
              />
              <label>{choice}</label>
            </div>
          ))}
        </div>
      );
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quiz.name}</h1>
      <p>{quiz.description}</p>
      {quiz.questions.map((question, index) => renderQuestion(question, index))}
      <button onClick={handleSubmit}>Submit</button>
      <p>
        Time taken:{" "}
        {endTime ? ((endTime - startTime) / 1000).toFixed(2) : "In Progress"}{" "}
        seconds
      </p>
    </div>
  );
}
