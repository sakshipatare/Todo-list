import { useEffect, useState } from "react";

export default function TeamMembers() {
  const [team, setTeam] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const apiUrl = "http://localhost:4000";

  useEffect(() => {
    const fetchTeamAndTasks = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      try {
        // ✅ Corrected endpoint name
        const teamRes = await fetch(`${apiUrl}/teams/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teamData = await teamRes.json();

        // Handle both cases — object or array
        const teamInfo = Array.isArray(teamData) ? teamData[0] : teamData;

        if (!teamInfo?._id) return;

        // ✅ Fetch all team tasks
        const tasksRes = await fetch(`${apiUrl}/tasks/team/${teamInfo._id}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskData = await tasksRes.json();

        // ✅ Safeguard: if no tasks property in response
        const allTasks = taskData.tasks || [];

        // ✅ Combine members + tasks
        const membersWithTasks = teamInfo.members.map((member) => {
          const memberTasks = allTasks.filter(
            (t) => t.userId?._id === member._id
          );
          const completed = memberTasks.filter((t) => t.isCompleted).length;
          const pending = memberTasks.length - completed;
          return { ...member, tasks: memberTasks, completed, pending };
        });

        setTeam({ ...teamInfo, members: membersWithTasks });
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };

    fetchTeamAndTasks();
  }, []);

  if (!team) return <p className="text-center mt-8">Loading team data...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center mt-4">
        {team.teamName} — Team Members
      </h1>

      {team.members.length > 0 ? (
        <ul className="space-y-4 max-w-3xl mx-auto">
          {team.members.map((member) => (
            <li
              key={member._id}
              className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpanded(expanded === member._id ? null : member._id)
                }
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <div className="text-sm text-gray-700">
                  ✅ {member.completed} | ⏳ {member.pending}
                </div>
              </div>

              {expanded === member._id && (
                <ul className="mt-3 ml-4 border-t pt-2 text-gray-700">
                  {member.tasks.length > 0 ? (
                    member.tasks.map((task) => (
                      <li
                        key={task._id}
                        className="flex justify-between py-1 text-sm"
                      >
                        <span
                          className={
                            task.isCompleted
                              ? "line-through text-gray-500"
                              : ""
                          }
                        >
                          {task.description}
                        </span>
                        <span
                          className={`${
                            task.isCompleted
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {task.isCompleted ? "Done" : "Pending"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No tasks yet</p>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">
          No members found in this team.
        </p>
      )}
    </div>
  );
}
