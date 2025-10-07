import { Users, ClipboardList, DollarSign, AlertCircle } from "lucide-react";

export default function Sidebar({ onSelect }) {
  const menu = [
    { label: "Team Members", icon: <Users size={20} /> },
    { label: "Penalty", icon: <AlertCircle size={20} /> },
    { label: "Tasks", icon: <ClipboardList size={20} /> },
    { label: "Payment", icon: <DollarSign size={20} /> },
    { label: "User", icon: <Users size={20} /> },
  ];

  return (
    <div className="w-60 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul>
        {menu.map((item) => (
          <li
            key={item.label}
            onClick={() => onSelect(item.label)}
            className="flex items-center gap-2 p-2 mb-2 rounded hover:bg-gray-700 cursor-pointer"
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
