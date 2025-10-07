import { useState } from "react";
import Sidebar from "../Component/Dashboard/Sidebar";
import MainContent from "../Component/Dashboard/MainContent";

export default function Dashboard() {
  const [selected, setSelected] = useState("Tasks");

  return (
    <div className="flex">
      <Sidebar onSelect={setSelected} />
      <MainContent selected={selected} />
    </div>
  );
}
