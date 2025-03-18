import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function QuestionnaireCatalog() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("name");
  const [, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/questionnaires");
      setQuestionnaires(res.data);
      setError("");
    } catch (error) {
      setError("Error fetching questionnaires");
      console.error("Error fetching questionnaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedQuestionnaires = [...questionnaires].sort((a, b) => {
    if (sortKey === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortKey === "questions") {
      return b.questions.length - a.questions.length;
    }
    return 0;
  });

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
    setValue("name", questionnaire.quizName);
    setValue("description", questionnaire.description);
  };

  const handleSave = async (data) => {
    if (!data.name || !data.description) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/questionnaires/${editingQuestionnaire}`,
        data
      );

      setQuestionnaires((prev) =>
        prev.map((q) =>
          q._id === editingQuestionnaire ? { ...q, ...res.data } : q
        )
      );

      setEditingQuestionnaire(null);
      setError("");
    } catch (error) {
      setError("Error updating questionnaire");
      console.error("Error updating questionnaire:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedQuestionnaires = Array.from(questionnaires);
    const [removed] = reorderedQuestionnaires.splice(source.index, 1);
    reorderedQuestionnaires.splice(destination.index, 0, removed);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/questionnaires",
        {
          order: reorderedQuestionnaires.map((q) => q._id),
        }
      );

      if (res.status === 200) {
        setQuestionnaires(reorderedQuestionnaires);
      }
    } catch (error) {
      setError("Error updating order");
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-row justify-between m-4">
        <h1 className="text-xl font-bold">Quiz Catalog</h1>
        <Link to={"/create"}>
          <h2 className="font-bold">Create Quiz</h2>
        </Link>
      </div>
      <div className="flex justify-center m-4">
        <select
          className="border-2 p-2 rounded-xl"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="questions">Sort by Number of Questions</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questionnaires">
          {(provided) => (
            <div
              className="w-[80%] h-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-hidden"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedQuestionnaires.map((q, index) => (
                <Draggable key={q._id} draggableId={q._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="card bg-[#FDFAF6] card-xs shadow-md rounded-xl p-5 border-2"
                    >
                      <form onSubmit={handleSubmit(handleSave)}>
                        <div className="flex flex-col gap-2">
                          {editingQuestionnaire === q._id ? (
                            <>
                              <div className="flex flex-col gap-1">
                                <h3 className="font-bold">Name:</h3>
                                <input
                                  name="name"
                                  placeholder="Quiz Name"
                                  className="font-normal bg-[#fff] border-2 p-2 rounded-xl"
                                  {...register("name", {
                                    required: "Name is required!",
                                    maxLength: {
                                      value: 10,
                                      message: "Max length is 10",
                                    },
                                  })}
                                />
                                {errors.name && (
                                  <p role="alert" className="text-red-600">
                                    {errors.name.message}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <h3 className="font-bold">Description:</h3>
                                <textarea
                                  name="description"
                                  placeholder="Quiz Description"
                                  className="font-normal bg-[#fff] border-2 p-2 rounded-xl"
                                  {...register("description", {
                                    required: "Description is required!",
                                    maxLength: {
                                      value: 50,
                                      message: "Max length is 50",
                                    },
                                  })}
                                />
                                {errors.description && (
                                  <p role="alert" className="text-red-600">
                                    {errors.description.message}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-row justify-between mt-4">
                                <button
                                  className="border-2 px-5 rounded-xl bg-[#fff]"
                                  type="submit"
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
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
