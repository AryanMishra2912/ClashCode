import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to clashCode</h1>
      <p className="text-gray-400 mb-8">Compete, collaborate, and conquer algorithms.</p>
      <div className="space-x-4">
        <Link to="/problems" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Explore Problems</Link>
        {!isLoggedIn && (
          <Link to="/login" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Login</Link>
        )}
      </div>
    </div>
  );
}