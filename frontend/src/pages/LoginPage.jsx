import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { api } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/signup/", {
        username,
        password,
        password_confirm: passwordConfirm,
      });
      // Auto-login after signup
      localStorage.setItem("token", res.data.access);
      await login(username, password);
      navigate("/");
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === "object") {
        const firstError = Object.values(errorData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError("Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SkillMap AI</h1>
          <p className="text-indigo-100">Master your learning journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Toggle Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setIsSignup(false);
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                !isSignup
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsSignup(true);
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                isSignup
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {!isSignup ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Choose a username (min 3 chars)"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Min 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Retype your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Helper text */}
          <p className="text-center text-gray-600 text-sm mt-6">
            {isSignup
              ? "Already have an account? Switch to Login above"
              : "Don't have an account? Click Sign Up above"}
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 text-white text-center text-sm">
          <p className="font-semibold mb-2">📝 Demo Credentials:</p>
          <p>Username: <span className="font-mono">admin</span></p>
          <p>Password: <span className="font-mono">admin123</span></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
