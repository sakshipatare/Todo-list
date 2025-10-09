import React, { useEffect, useState } from "react";
import "./User.css";

function User() {
  const [user, setUser] = useState(null);
  const [teamInfo, setTeamInfo] = useState(null);
  const apiUrl = "http://localhost:4000";

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // 🔥 Fetch team info using user ID
        fetch(`${apiUrl}/teams/by-user/${parsedUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.teamName) {
              setTeamInfo(data);
            }
          })
          .catch((err) => console.error("Error fetching team info:", err));
      } catch (err) {
        console.error("Invalid JSON in localStorage:", err);
      }
    }
  }, []);

  if (!user) return <p>No user data found. Please login again.</p>;

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: "#f2f2f2" }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Team Profile
        </h2>

        {/* 👤 User Info */}
        <label className="block font-semibold mb-1">Name:</label>
        <input
          type="text"
          value={user.name || ""}
          readOnly
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
        />

        <label className="block font-semibold mb-1">Email:</label>
        <input
          type="text"
          value={user.email || ""}
          readOnly
          className="w-full mb-6 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
        />

        {/* 🧑‍🤝‍🧑 Team Info */}
        {teamInfo ? (
          <>
            <label className="block font-semibold mb-1">Team Name:</label>
            <input
              type="text"
              value={teamInfo.teamName}
              readOnly
              className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            />

            <label className="block font-semibold mb-1">Team Members:</label>
            <input
              type="text"
              value={teamInfo.members?.length || 0}
              readOnly
              className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            />

            <label className="block font-semibold mb-1">Team Admin:</label>
            <input
              type="text"
              value={teamInfo.admin?.name || "Admin"}
              readOnly
              className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            />

            <label className="block font-semibold mb-1">Penalty Per Missed Task:</label>
            <input
              type="text"
              value={teamInfo.penaltyPerMissedTask}
              readOnly
              className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            />
          </>
        ) : (
          <p className="text-center text-gray-600 mt-4">
            You are not part of any team yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default User;
