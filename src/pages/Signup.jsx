import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State for loader
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(""); // State for success or error messages

  useEffect(() => {
    const exp = localStorage.getItem("logs");
    if (exp === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/addUser`, formData);

      if (response.status === 201) {
        setMessage("Signup successful!");
        setLoading(false);
        setTimeout(() => {
          navigate("/login"); 
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Signup</h2>

        {message && (
          <div className={`mb-4 p-2 rounded ${message.includes("successful") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-black dark:text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          {loading ? (
            <div className="flex justify-center mb-4">
              <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
            </div>
          ) : (
            <button type="submit" className="w-full p-2 bg-blue-500 dark:bg-blue-700 text-white rounded">
              Signup
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
