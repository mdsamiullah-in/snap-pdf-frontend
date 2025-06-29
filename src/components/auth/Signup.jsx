import React, { useState } from "react";
import http from "../../../util/http";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "", // 👈 Match schema
    email: "",
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await http.post("/api/user/signup", formData);
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 space-y-6 shadow-md rounded-lg">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold font-[calibri] text-gray-800">Sign Up</h1>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            Create an account on&nbsp;
            <span className="flex items-center gap-1">
              <img src="./images/logos.png" alt="logo" className="w-[100px]" />
            </span>
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullname" className="text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            required
          />
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label htmlFor="mobile" className="text-sm text-gray-700">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-sm text-gray-500 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-sm text-red-500 text-center">{error}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded-lg font-medium transition duration-200`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <div className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
