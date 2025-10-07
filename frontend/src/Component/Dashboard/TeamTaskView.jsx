import { useEffect, useState } from "react";

export default function TeamTaskView() {
  const [teamTasks, setTeamTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamId = localStorage.getItem("teamId"); // or get from user object

  useEffect(() => {
    if (!teamId) return;
    const token = localStorage.getItem("token");
    const fetchTeamTasks = async () => {
      try {
        const res = await fetch(`http://localhost:4000/tasks/team/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTeamTasks(data.tasks || []);
      } catch (err) {
        console.error("Error fetching team tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamTasks();
  }, [teamId]);

  if (loading) return <p>Loading team tasks...</p>;
  if (!teamId) return <p>No team created yet.</p>;

  // Group tasks by user
  const grouped = teamTasks.reduce((acc, task) => {
    const user = task.user?.name || "Unknown";
    acc[user] = acc[user] || [];
    acc[user].push(task);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-3">Team Members Progress</h2>
      {Object.entries(grouped).map(([user, tasks]) => {
        const completed = tasks.filter((t) => t.completed).length;
        const total = tasks.length;
        return (
          <div key={user} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{user}</span>
              <span>{completed}/{total} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(completed / total) * 100}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
