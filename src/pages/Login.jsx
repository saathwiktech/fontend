import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext'; 
import { jwtDecode } from "jwt-decode";

import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate= useNavigate();
  const { login,isLoggedIn, setuSerData,user } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState();
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
useEffect(() => {
   const exp= localStorage.getItem('logs');
   if(exp=="true"){
       navigate('/dashboard')
   }

   console.log(import.meta.env.VITE_API_URL)
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');  

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/loginUser`, {
        email,
        password,
      });
      const decoded = jwtDecode(response.data.token);
      setToken(response.data.token);
      setMessage(response.data.message);
     
          setuSerData({
            userId: decoded.userId,
            name: response.data.name || '',
            email: response.data.email,
            currentProjectId: response.data.currentProjectId || null,
            currentWorkId: response.data.currentWorkId || null,
            Token: response.data.token,
            expiry: decoded.exp
          });
          localStorage.setItem('token', response.data.token);
          login(decoded);  
    } catch (error) {
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black dark:text-white">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-black dark:text-white">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 dark:bg-blue-700 text-white rounded"
            disabled={isLoading} 
          >
            Login
          </button>
        </form>

       
        {isLoading && <Loader />} 

        {message && (
          <div className={`mt-4 text-center ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
