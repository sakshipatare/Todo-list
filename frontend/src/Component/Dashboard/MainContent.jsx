// src/components/Dashboard/MainContent.jsx
import { useEffect, useState } from "react";
import User from "../../pages/User"; // ✅ Import at the top
import TeamMembers from "../../pages/TeamMembers";

export default function MainContent({ selected }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const apiUrl = "http://localhost:4000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${apiUrl}/tasks/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const teamId = localStorage.getItem("teamId");
    if (!token || !newTask.trim() || !teamId) return;

    try {
      const res = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newTask,
          teamId,
          date: new Date(),
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setTasks((prev) => [...prev, result.task]);
        setNewTask("");
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTaskComplete = async (taskId, isCompleted) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          )
        );
      }
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 h-full overflow-y-auto">
      {selected === "User" ? (
        <User />
      ) : selected === "Team Members" ? ( // ✅ Handle new sidebar option
        <TeamMembers />
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task..."
              className="flex-1 border p-2 rounded-l"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              Add
            </button>
          </form>

          {/* Task List */}
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
                >
                  <span
                    onClick={() =>
                      toggleTaskComplete(task._id, task.isCompleted)
                    }
                    className={`cursor-pointer ${
                      task.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.description}
                  </span>
                  <span
                    className={`text-sm ${
                      task.isCompleted ? "text-green-600" : "text-orange-500"
                    }`}
                  >
                    {task.isCompleted ? "Done" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No tasks yet.</p>
          )}
        </>
      )}
    </div>
  );
}
