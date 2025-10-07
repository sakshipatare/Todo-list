import { useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Design UI", completed: true },
    { id: 2, name: "Connect API", completed: false },
    { id: 3, name: "Testing", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {tasks.map(task => (
        <div key={task.id} className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            className="w-5 h-5"
          />
          <span className={`${task.completed ? "line-through text-gray-500" : ""}`}>
            {task.name}
          </span>
        </div>
      ))}
    </div>
  );
}
