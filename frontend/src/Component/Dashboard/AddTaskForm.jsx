import { useState } from "react";

export default function AddTaskForm() {
  const [task, setTask] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    console.log("Added task:", task);
    setTask("");
  };

  return (
    <form onSubmit={handleAdd} className="flex gap-2">
      <input
        type="text"
        placeholder="Enter your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="flex-1 border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}
