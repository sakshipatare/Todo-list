import { useState } from "react";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import TeamTaskView from "./TeamTaskView";
import CreateTeamModal from "./CreateTeamModal";

export default function MainContent() {
  const [showTeamModal, setShowTeamModal] = useState(false);

  return (
    <div className="flex-1 p-6 bg-gray-100 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Team Task Progress</h1>
        <button
          onClick={() => setShowTeamModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>

      {/* 🧍 Team Task Section */}
      <TeamTaskView />

      {/* 📝 Personal Task Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
        <TaskList />
        <AddTaskForm />
      </div>

      {showTeamModal && <CreateTeamModal onClose={() => setShowTeamModal(false)} />}
    </div>
  );
}
