import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function SignupPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.post("users/signup/", form);
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.username ||
                err.response?.data?.password ||
                "Signup failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow w-96 space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Create Account</h1>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                <div className="text-sm text-center">
                    Already have an account?{" "}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </div>
            </form>
        </div>
    );
}
