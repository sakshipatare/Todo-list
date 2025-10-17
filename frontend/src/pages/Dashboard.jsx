// src/pages/Dashboard.jsx
import { useState } from "react";
import Sidebar from "../Component/Dashboard/Sidebar.jsx";
import MainContent from "../Component/Dashboard/MainContent.jsx";

export default function Dashboard() {
  const [selected, setSelected] = useState("Tasks"); // default view

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setSelected} />
      <MainContent selected={selected} />
    </div>
  );
}
