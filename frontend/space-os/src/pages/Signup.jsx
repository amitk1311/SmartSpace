import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Validation functions
  const isValidEmail = (email) => {
    // Only Gmail addresses allowed
    const gmailRegex = /^[a-zA-Z0-9._%-]+@gmail\.com$/;
    return gmailRegex.test(email.toLowerCase());
  };

  const isStrongPassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(form.email)) newErrors.email = "Please enter a valid Gmail address (e.g., yourname@gmail.com)";

    if (!form.password) newErrors.password = "Password is required";
    else if (!isStrongPassword(form.password)) newErrors.password = "Password must be at least 8 characters";

    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await api.auth.register(form.name, form.email, form.password, form.confirmPassword);

      setAuthToken(data.token, data.user.id);
      setSuccess("Account created successfully! Redirecting...");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      setErrors({});

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setErrors({ server: err.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-green-50 to-emerald-100">

      {/* glow blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 opacity-40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 opacity-40 blur-3xl rounded-full"></div>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-8 space-y-5"
      >

        {/* title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Join SmartSpace platform
          </p>
        </div>

        {/* server error */}
        {errors.server && (
          <p className="bg-red-100 text-red-700 text-sm p-3 rounded-lg">{errors.server}</p>
        )}

        {/* success message */}
        {success && (
          <p className="bg-green-100 text-green-700 text-sm p-3 rounded-lg">{success}</p>
        )}

        {/* name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Gmail Address (e.g., yourname@gmail.com)"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* confirm password */}
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition shadow-md disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* login */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}