import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';
function DefaultValues() {
  const { user } = useAuth();
  const [defaultValues, setDefaultValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFields, setNewFields] = useState([]);
  
  // Fetch default values when the component loads
  const Token = localStorage.getItem('token');
  const decoded= jwtDecode(Token)
  useEffect(() => {
    const fetchDefaultValues = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getDefault/${decoded.userId}`,{
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        setDefaultValues(response.data.data.fields);
      } catch (error) {
        console.error('Error fetching default values:', error);
      }
    };

    fetchDefaultValues();
  }, [user.userId, Token]);

  // Handle adding new fields in the modal
  const handleAddField = () => {
    setNewFields([...newFields, { name: '', sft: 0, cft: 0 }]);
  };

  // Handle input change for new fields
  const handleInputChange = (index, field, value) => {
    const updatedFields = [...newFields];
    updatedFields[index][field] = value;
    setNewFields(updatedFields);
  };

  // Save new default values to the database
  const saveNewFields = async () => {
    try {
      const requestBody = {
        userId: user.userId,
        newFields,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/addDefault/`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setDefaultValues(response.data.data.fields);
      setNewFields([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving default values:', error);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h1 className="text-xl font-bold mb-4">Default Values</h1>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold">User ID:</h2>
        <p>{user.userId}</p>
        <h2 className="text-lg font-semibold mt-4">Fields:</h2>
        <ul>
          {defaultValues && defaultValues.map((field) => (
            <li key={field._id} className="mb-2">
              <strong>{field.name}:</strong>{' '}
              {field.units.map((unit) => (
                <span key={unit._id} className="inline-block mr-2">
                  {unit.name}: {unit.value}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Add Default Values
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-h-[80vh] overflow-y-auto w-[90%] md:w-[60%]">
            <h2 className="text-lg font-bold mb-4">Add New Fields</h2>
            {newFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label>Enter the Name: </label>
                <input
                  type="text"
                  placeholder="Field Name"
                  value={field.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="border p-2 rounded mb-2 w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <label>Enter the Cost per SFT (₹): </label>
                <input
                  type="number"
                  placeholder="SFT Value"
                  value={field.sft}
                  min={0}
                  onChange={(e) => handleInputChange(index, 'sft', e.target.value)}
                  className="border p-2 rounded mb-2 w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <label>Enter the Cost per CFT (₹): </label>
                <input
                  type="number"
                  placeholder="CFT Value"
                  value={field.cft}
                  min={0}
                  onChange={(e) => handleInputChange(index, 'cft', e.target.value)}
                  className="border p-2 rounded mb-2 w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </div>
            ))}
            <button
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded m-1 hover:bg-green-600"
              onClick={handleAddField}
            >
              Add Another Field
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded m-1 hover:bg-blue-600"
              onClick={saveNewFields}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 ml-2 rounded m-1 hover:bg-red-600"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 ml-2 rounded m-1 hover:bg-purple-600"
              onClick={() => {
                setNewFields([]);
                setIsModalOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DefaultValues;
