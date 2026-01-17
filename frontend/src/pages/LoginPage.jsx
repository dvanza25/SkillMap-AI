import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4">
            <span className="text-white text-2xl font-bold">🎯</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            SkillMap AI
          </h1>
          <p className="text-gray-500 text-sm">Accelerate Your Learning Journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <span className="text-red-600 text-lg">⚠️</span>
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
          Sign In
        </button>

        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </span>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Demo credentials: admin / admin
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
