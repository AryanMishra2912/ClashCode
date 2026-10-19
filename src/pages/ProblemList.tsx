import { Link } from "react-router-dom";

export default function ProblemList() {
  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Problem Set</h1>
      <ul className="space-y-2">
        <li><Link to="/problem/1" className="text-blue-400 hover:underline">1. Two Sum</Link></li>
        <li><Link to="/problem/2" className="text-blue-400 hover:underline">2. Reverse Linked List</Link></li>
      </ul>
    </div>
  );
}