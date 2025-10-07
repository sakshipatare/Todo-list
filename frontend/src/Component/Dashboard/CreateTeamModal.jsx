import { useState } from "react";

export default function CreateTeamModal({ onClose }) {
  const [teamName, setTeamName] = useState("");

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:4000/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: teamName }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("teamId", data.team._id);
        alert("Team created!");
        onClose();
      } else {
        alert(data.message || "Failed to create team");
      }
    } catch (err) {
      console.error("Error creating team:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-3">Create New Team</h2>
        <input
          type="text"
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
