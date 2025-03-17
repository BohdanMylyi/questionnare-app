import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function QuestionnaireCatalog() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/questionnaires");
      setQuestionnaires(res.data);
      console.log(res.data);
      setError("");
    } catch (error) {
      setError("Error fetching questionnaires");
      console.error("Error fetching questionnaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/questionnaires/${id}`);
      setQuestionnaires((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      setError("Error deleting questionnaire");
      console.error("Error deleting questionnaire:", error);
    }
  };

  const handleEdit = (questionnaire) => {
    setEditingQuestionnaire(questionnaire._id);
    setFormData({
      name: questionnaire.name,
      description: questionnaire.description,
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/questionnaires/${editingQuestionnaire}`,
        formData
      );

      setQuestionnaires((prev) =>
        prev.map((q) =>
          q._id === editingQuestionnaire ? { ...q, ...res.data } : q
        )
      );

      setEditingQuestionnaire(null);
      setFormData({ name: "", description: "" });
      setError("");
    } catch (error) {
      setError("Error updating questionnaire");
      console.error("Error updating questionnaire:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full ">
      <div className="flex flex-row justify-between m-4">
        <h1 className="text-xl font-bold">Quiz Catalog</h1>
        <Link to={"/create"}>
          <h2 className="font-bold">Create Quiz</h2>
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      <div className="w-[80%] h-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-hidden">
        {questionnaires.map((q) => (
          <div
            key={q._id}
            className="card bg-[#FDFAF6] card-xs shadow-md rounded-xl p-5 border-2 "
          >
            <div className="flex flex-col gap-2">
              {editingQuestionnaire === q._id ? (
                <>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold">Name:</h3>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Quiz Name"
                      className="font-normal bg-[#fff] border-2 p-2 rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold">Description:</h3>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Quiz Description"
                      className="font-normal bg-[#fff] border-2 p-2 rounded-xl"
                    />
                  </div>
                  <div className="flex flex-row justify-between mt-4">
                    <button
                      className="border-2 px-5 rounded-xl bg-[#fff]"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="border-2 px-5 rounded-xl bg-[#fff]"
                      onClick={() => setEditingQuestionnaire(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">{q.name}</h3>
                  <p>{q.description}</p>
                  <p className="text-blue-500">
                    Questions: {q.questions.length}
                  </p>
                  <div className="flex flex-row justify-between mt-4">
                    <button
                      className="border-2 px-5 rounded-xl bg-[#fff]"
                      onClick={() => handleEdit(q)}
                    >
                      Edit
                    </button>
                    <button
                      className="border-2 px-5 rounded-xl bg-[#fff]"
                      onClick={() => handleDelete(q._id)}
                    >
                      Delete
                    </button>
                    <Link to={`/quiz/${q._id}`}>
                      <button className="border-2 px-5 rounded-xl bg-[#fff]">
                        Run
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
