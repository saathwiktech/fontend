import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ClipLoader } from "react-spinners";
import { Link,useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaTrash } from 'react-icons/fa';

const ProjectList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    clientname: "",
    clientnumber: "",
    clientaddress: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const Token = localStorage.getItem('token');
  const decoded=jwtDecode(Token);
  // console.log(decoded)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getProjects/${decoded.userId}`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        setProjects(response.data.projects);
        console.log(response.data)
      } catch (err) {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    // if (user?.userId && user?.Token) {
      fetchProjects();
    // }
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/addProject/${decoded.userId}`,
        newProject,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setProjects((prevProjects) => [...prevProjects, response.data.project]);
      setShowModal(false);
      setNewProject({
        name: "",
        clientname: "",
        clientnumber: "",
        clientaddress: "",
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
    finally{
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteProject = async (pid) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/deleteProject/${decoded.userId}`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json',
        },
        data: {
          pid: pid
        }
      });

      if (response.status === 200) {
        // Remove the project from the UI without needing to reload
        setLoading(false);
        setProjects((prevProjects) => prevProjects.filter(project => project._id !== pid));
        // alert('Project deleted successfully!');
      } else {
        alert('Failed to delete project');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error deleting project:', error);
      alert('An error occurred while deleting the project');
    }
    finally{
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Project List</h1>

      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        Create Project
      </button>

      {projects.length > 0 ? (
        <ul className=" flex items-center flex-col space-y-2 ">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-gray-100 rounded shadow-md dark:bg-gray-800 dark:text-white text-center p-6 w-full flex justify-around "
            >
              <Link
                to={`/dashboard/projects/${project._id}`}
                className="text-xl font-semibold text-blue-600 hover:underline dark:text-blue-300"
              >
                {project.name}
              </Link>
              {/* <p className="text-gray-500 dark:text-gray-400">Project ID: {project._id}</p> */}
              {/* Delete Project Button */}
              <button
                onClick={() => handleDeleteProject(project._id)}
                className=""
              >
                <FaTrash size={24} className="text-red-500 hover:text-red-700 transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
      )}

      {/* Modal to create a project */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 dark:bg-gray-800 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Create Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-900 dark:text-white">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-900 dark:text-white">Client Name</label>
                <input
                  type="text"
                  name="clientname"
                  value={newProject.clientname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-900 dark:text-white">Client Number</label>
                <input
                  type="number"
                  name="clientnumber"
                  value={newProject.clientnumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-900 dark:text-white">Client Address</label>
                <input
                  type="text"
                  name="clientaddress"
                  value={newProject.clientaddress}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
