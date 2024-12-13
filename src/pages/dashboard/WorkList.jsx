import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DownloadPdf from "../../components/Buttons/DownloadPdf";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
const WorkList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pid } = useParams();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkName, setNewWorkName] = useState('');

  const [fields, setFields] = useState([]);
  const [newFieldVal, setNewFieldVal] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const [sftValue, setSftValue] = useState('');
  const [cftValue, setCftValue] = useState('');

  const Token = localStorage.getItem('token');
  const decoded = jwtDecode(Token)
  useEffect(() => {

    const fetchFields = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getDefault/${decoded.userId}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
        );
        // console.log(response.data.data[0].fields)
        // const fieldNames = response.data.data[0].fields.map(field => field.name);
        const fieldNames = [
          "foundation",
          "painting",
          "centering",
          "Flooring",
          "ww",
          "drsrdrds",
        ]
        setFields(fieldNames);
        // console.log("fields",fields)
        // let fieldNamesvalues = response.data.data[0].fields.map(field => {
        //   let name = {
        //     name: field.name,
        //     sft: field.units[0].value,
        //     cft: field.units[1].value
        //   }
        //   return name;
        // });

        let fieldNamesvalues = [
          {
            "name": "foundation",
            "sft": 34,
            "cft": 56
          },
          {
            "name": "painting",
            "sft": 0,
            "cft": 0
          },
          {
            "name": "centering",
            "sft": 0,
            "cft": 0
          },
          {
            "name": "Flooring",
            "sft": 12,
            "cft": 34
          },
          {
            "name": "ww",
            "sft": 1,
            "cft": 1
          },
          {
            "name": "drsrdrds",
            "sft": 2,
            "cft": 5
          },
          {
            "name": "ugu",
            "sft": 2,
            "cft": 556
          }
        ]


        // console.log("fied",fieldNamesvalues);
        setNewFieldVal(fieldNamesvalues);
      } catch (err) {
        setError("Failed to fetch fields");
      }
    };

    // fetch all the works
    const fetchProjectDetails = async () => {

      try {
        setLoading(true);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/getWorks/${pid}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        // console.log("response",response.data.works)
        let Wf = response.data.works
        setWorks(Wf);
        // console.log(works)
      } catch (err) {
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    // if (isModalOpen) {
    fetchProjectDetails();
    fetchFields();

  }, []);

  // get the sft and cft values
  useEffect(() => {
    const selectedField = newFieldVal.find((field) => field.name === newWorkName);
    if (selectedField) {
      setSftValue(selectedField.sft);
      setCftValue(selectedField.cft);
    }
  }, [newWorkName, newFieldVal]);

  // console.log(newFieldVal)

  const handleAddWork = async () => {
    if (!newWorkName) {
      alert("Please enter a work name");
      return;
    }
    let payload = {
      name: newWorkName,
      sft: sftValue,
      cft: cftValue
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/addWork/${pid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setWorks((prevWorks) => [...prevWorks, response.data.work]);
      setSuccessMessage(response.data.message);
      setIsModalOpen(false);
      setNewWorkName('');
      console.log(payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add work");
    }
  };

  const handleDeleteWork = async (wid) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/deleteWork/${wid}`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        // Remove the project from the UI without needing to reload
        setWorks((prevWorks) => prevWorks.filter(works => works._id !== wid));
        // navigate(-1);
        // alert('Work deleted successfully!');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting Work:', error);
      alert('An error occurred while deleting the Work');
    }
  };
  const downloadExcel = async (wid) => {
    console.log("Work id :",wid)
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/pdf-generate/${wid}`, {
            responseType: "blob", // Important: Ensures the response is treated as binary data
            headers: {
                Authorization: `Bearer ${Token}`, // Include the Authorization header
            },
        });

        // Create a blob URL
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const blobURL = window.URL.createObjectURL(blob);

        // Trigger download
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "Subwork_Details.xlsx";
        link.click();

        // Clean up
        window.URL.revokeObjectURL(blobURL);
    } catch (error) {
        console.error("Error downloading Excel file:", error);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Works</h1>
      <button
        onClick={() => navigate(-1)} // Navigate back
        className=" mx-1 bg-gray-500 text-white px-4 py-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
      >
        Go Back
      </button>
      {successMessage && (
        <div className="bg-green-200 p-4 mb-4 text-green-700 rounded dark:bg-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 dark:bg-blue-700 dark:text-white"
      >
        Add Work
      </button>

      {works.length > 0 ? (
        <ul className="space-y-2">
          {works.map((work) => (
            <div className="block p-4 bg-white rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-10 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:shadow-gray-600"
            >
            <Link
              to={`/dashboard/projects/works/${work._id}`}
              key={work._id}
              >
              <h2 className="text-3xl font-bold p-2 text-center text-gray-800 dark:text-gray-100">{work.name}</h2>
              {/* <p className="text-gray-500 dark:text-gray-400">Work ID: {work._id}</p> */}
            </Link>
              <div>
              <button
                onClick={() => handleDeleteWork(work._id)}
                className="bg-red-500 text-white py-2 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors duration-300 shadow-lg disabled:opacity-50 my-1"
>
                Delete Work
              </button>
                  </div>
              <button
                onClick={() => downloadExcel(work._id)}
                className="bg-green-500 text-white py-2 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors duration-300 shadow-lg disabled:opacity-50 my-1"
>
                Download Xcell
              </button>
              <div>
                <DownloadPdf wid={work._id} Token={Token} />
              </div>
              
                </div>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center dark:text-gray-400">No works found.</p>
      )}

      {/* Modal for adding work */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 dark:bg-gray-800 dark:text-white">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add Work</h2>
            <input
          type="text"
          value={newWorkName}
          onChange={(e) => setNewWorkName(e.target.value)}
          className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
          placeholder="Enter work name"
        />
            {/* <select
              value={newWorkName}
              onChange={(e) => setNewWorkName(e.target.value)}
              className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
            >
              <option value="">Select Work Field</option>
              {fields.map((field, index) => (
                <option key={index} value={field}>
                  {field}
                </option>
              ))}
            </select> */}
            {/* <div>
              {newFieldVal.map((field, index) => (
                <div key={index}>
                  {field.name === newWorkName ? (

                    <>
                      <label >Cost per SFT  ₹  </label>
                      <input type="text" value={sftValue || field.sft} onChange={(e) => { setSftValue(e.target.value) }} />
                      <br />
                      <label >Cost per CFT  ₹ : </label>
                      <input type="text" value={cftValue || field.cft} onChange={(e) => { setCftValue(e.target.value) }} />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div> */}
            <div className="flex justify-end">
              <button
                onClick={handleAddWork}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 dark:bg-green-700"
              >
                Add Work
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
};

export default WorkList;
