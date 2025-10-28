import { useEffect, useState } from "react";

export default function TeamPenaltyPage() {
  const [teamPenalties, setTeamPenalties] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);

  const apiUrl = "http://localhost:4000";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeamPenalties = async () => {
      try {
        const teamRes = await fetch(`${apiUrl}/teams/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teamData = await teamRes.json();
        const team = Array.isArray(teamData) ? teamData[0] : teamData;
        if (!team?._id) return;

        setTeamName(team.teamName);

        const penaltyRes = await fetch(`${apiUrl}/penalties/team/${team._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const penaltyData = await penaltyRes.json();

        const grouped = {};

        penaltyData.penalties.forEach((p) => {
          const uid = p.userId?._id;
          if (!grouped[uid]) {
            grouped[uid] = {
              _id: uid,
              name: p.userId?.name,
              email: p.userId?.email,
              total: 0,
              details: [],
            };
          }
          grouped[uid].details.push({
            id: p._id, // ✅ use backend _id for unique key
            task: p.taskId?.description,
            date: p.taskId?.date,
            penalty: p.penaltyAmount,
          });
          grouped[uid].total += p.penaltyAmount;
        });

        setTeamPenalties(Object.values(grouped));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team penalties:", err);
      }
    };

    fetchTeamPenalties();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p className="text-center mt-8">Loading team penalties...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {teamName || "Team"} — Penalty Board
      </h1>

      {teamPenalties.length > 0 ? (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamPenalties.map((member) => (
            <div
              key={member._id} // ✅ always unique per user
              className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{member.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{member.email}</p>

              <p className="text-red-600 font-bold text-xl mb-4">
                Total Penalty: ₹{member.total}
              </p>

              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1 mb-2">
                Missed Tasks
              </h3>

              {member.details.length > 0 ? (
                <ul className="space-y-2">
                  {member.details.map((d) => (
                    <li
                      key={d.id} // ✅ unique backend _id used here
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>{d.task || "No description"}</span>
                      <span className="text-gray-500">
                        {d.date ? new Date(d.date).toLocaleDateString() : "N/A"}
                      </span>
                      <span className="text-red-600 font-semibold">₹{d.penalty}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No penalties yet 🎉</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 italic">No penalties recorded yet.</p>
      )}
    </div>
  );
}
