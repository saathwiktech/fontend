import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import { FaCheck, FaStudiovinari, FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import DownloadPdfSubwork from "../../components/Buttons/DownloadPdfSubwork";
import DownloadExcell from "../../components/Buttons/DownloadExcell";
import { toast } from 'react-toastify';




function SubWorkList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wid } = useParams();
  const [subworks, setSubworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubwork, setNewSubwork] = useState({
    name: "",
    length: 0,
    breadth: 0,
    depth: 0,
    totalval: 0,
  });

  const [isEditing, setIsEditing] = useState(null); // Track which subwork is being edited
  const [editName, setEditName] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const Token = localStorage.getItem("token");
  useEffect(() => {
    const fetchSubWorks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getSubWorks/${wid}`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        setSubworks(response.data.subworks);
      } catch (err) {
        setError("Failed to fetch subworks");
      } finally {
        setLoading(false);
      }
    };

    fetchSubWorks();
  }, [wid, user]);

  // edit functions
  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/updateNameofSubWork/${id}`,
        { name: editName },
        {
          headers: { Authorization: `Bearer ${Token}` },
        }
      );
      // if(response.status === 201){
      //   setSubworks((prevSubworks) =>
      //     prevSubworks.map((subwork) =>
      //       subwork._id === id ? { ...subwork, name: editName } : subwork
      //     )
      //   );
      // }else{
      //   alert("Error updating subwork");
      // }
      if (response.status === 201) {
        setSubworks((prevSubworks) =>
          prevSubworks.map((subwork) =>
            subwork._id === id ? { ...subwork, name: editName } : subwork
          )
        );
        toast.success("Subwork updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        toast.error("Error updating subwork", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setIsEditing(null);
    } catch (error) {
      console.error("Failed to update subwork:", error);
      toast.error("Failed to update subwork. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditName("");
  };

  const handleEditClick = (id, currentName) => {
    setIsEditing(id);
    setEditName(currentName);
  };

  const handleAddSubWork = async () => {
    const { name, length, breadth, depth, totalval } = newSubwork;

    if (!name) {
      alert("Please enter a subwork name");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/addSubWork/${wid}`,
        { name, length, breadth, depth, totalval },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setSubworks((prevSubworks) => [...prevSubworks, response.data.subwork]);
      setSuccessMessage(response.data.message);
      setIsModalOpen(false);
      setNewSubwork({
        name: "",
        length: 0,
        breadth: 0,
        depth: 0,
        totalval: 0,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to add subwork");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubWork = async (swid) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/deleteSubWork/${swid}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSubworks((prevSubWorks) =>
          prevSubWorks.filter((subworks) => subworks._id !== swid)
        );
        setLoading(false);
        // alert("Subwork deleted successfully!");
      } else {
        alert("Failed to delete Subwork");

        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setLoading(false);
      alert("An error occurred while deleting the Subwork");
    }
  };
  const handleDownloadPdf = async (swid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/subwork-pdf-generate/${swid}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      alert("An error occurred while deleting the Subwork");
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
    <div className="">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Subworks
      </h1>
      {/* <div className="mx-1"> */}

      <button
        onClick={() => navigate(-1)} // Navigate back
        className=" mx-1 bg-gray-500 text-white px-4 py-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
      >
        Go Back
      </button>
      {/* </div> */}
      {successMessage && (
        <div className="bg-green-200 p-4 mb-4 text-green-700 rounded dark:bg-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 dark:bg-blue-700 dark:text-white"
      >
        Add Subwork
      </button>

      <div className="max-h-[80vh] overflow-y-auto max-h-scroll pb-40 pt-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {subworks.length > 0 ? (
          <ul className="space-y-2  ">
            {subworks.map((subwork) => (
              <div className=" p-8 bg-white rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-10 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:shadow-gray-600 flex flex-col items-center">
                <Link
                  to={`/dashboard/projects/works/subwork/${subwork._id}`}
                  key={subwork._id}
                // className=" p-8 bg-white rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-10 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:shadow-gray-600 flex justify-between"
                >
                   {isEditing === subwork._id ? (<></>) : (

                     <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                     {subwork.name.toUpperCase()}
                     </h2>
                    )}
                  {/* <p className="text-gray-500 dark:text-gray-400">Subwork ID: {subwork._id}</p> */}
                </Link>
                  {isEditing === subwork._id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded  text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                   <></>
                  )}
                <div className="flex justify-center gap-6 mt-4 ml-5">

                  {/* edit Name OF Subwork  */}
                  {/* <EditSubworkBtn wid={subwork._id} Token={Token} /> */}
                  {isEditing === subwork._id ? (
                    <>
                      <button onClick={() => handleSaveEdit(subwork._id)} className="text-green-500">
                        <FaCheck size={25} />
                      </button>
                      <button onClick={handleCancelEdit} className="text-red-500">
                        <FaTimes size={25} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeleteSubWork(subwork._id)}
                        className=""
                      >
                        <FaTrash
                          size={24}
                          className="text-red-500 hover:text-red-700 transition-all duration-300"
                        />
                      </button>

                      <DownloadPdfSubwork wid={subwork._id} Token={Token} />
                      <DownloadExcell wid={subwork._id} Token={Token} />
                      <button onClick={() => handleEditClick(subwork._id, subwork.name)} className="text-blue-500">
                        <FaEdit size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center dark:text-gray-400">
            No subworks found.
          </p>
        )}
      </div>
      {/* Modal for adding subwork */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 dark:bg-gray-800 dark:text-white">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Add Subwork
            </h2>
            <label>Name</label>
            <input
              type="text"
              value={newSubwork.name}
              onChange={(e) =>
                setNewSubwork({ ...newSubwork, name: e.target.value })
              }
              className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
              placeholder="Enter subwork name"
            />

            <div className="flex justify-end">
              <button
                onClick={handleAddSubWork}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 dark:bg-green-700"
              >
                Add Subwork
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded dark:bg-gray-600 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export default SubWorkList;
