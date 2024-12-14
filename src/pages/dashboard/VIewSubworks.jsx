import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaTrash, FaEdit } from "react-icons/fa";
function VIewSubworks() {
  const { user } = useAuth();
  const { wid } = useParams();
  const navigate = useNavigate();
  const [subworks, setSubworks] = useState([]);
  const [newSubworks, setNewSubworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subwname, setSubwname] = useState("");
  const [reductions, setreductions] = useState([]);
  const [r, setr] = useState(false);
  const [reductionform, setreductionform] = useState({
    name: "",
    number: "1",
    length: "0",
    breadth: "0",
    depth: "0",
    quantity: "1",
  });
  const [formData, setFormData] = useState({
    name: "",
    number: "1",
    length: "0",
    breadth: "0",
    depth: "0",
    quantity: "1",
  });
  const [editingSubwork, setEditingSubwork] = useState(null);
  const [units, setunits] = useState({ SFT: 0, CFT: 0 });
  const [totalQuantity, settotalQuantity] = useState(0);
  const [RtotalQuantity, settotalRQuantity] = useState(0);

  const Token = localStorage.getItem("token");
  const decoded = jwtDecode(Token);
  useEffect(() => {
    settotalQuantity(
      subworks.reduce(
        (acc, subwork) => acc + parseInt(subwork.quantity || 0),
        0
      )
    );
    // console.log(subworks);
  }, [subworks]);

  useEffect(() => {
    const fetchSubworks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getSubWorksDetailes/${wid}`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        const fetchedSubworks = response.data.subworks[0].details;
        const fetchedReductions = response.data.subworks[0].reductions;
        const unitsDefault = response.data.subworks[0].default;
        let sum = 0;
        // Modify the quantity for each subwork
        const updatedSubworks = fetchedSubworks.map((subwork) => {
          const updatedQuantity =
            unitsDefault.SFT !== 0
              ? subwork.length * subwork.breadth * subwork.number
              : subwork.length *
                subwork.breadth *
                subwork.depth *
                subwork.number;
          sum += updatedQuantity;
          return { ...subwork, quantity: updatedQuantity };
        });
        sum = 0;
        const updatedReductions = fetchedReductions.map((redeuction) => {
          const updatedQuantity =
            unitsDefault.SFT !== 0
              ? redeuction.length * redeuction.breadth * redeuction.number
              : redeuction.length *
                redeuction.breadth *
                redeuction.depth *
                redeuction.number;
          sum += updatedQuantity;
          return { ...redeuction, quantity: updatedQuantity };
        });

        // Update the state
        settotalQuantity(sum);
        settotalRQuantity(sum);
        setunits(unitsDefault);
        setSubworks(updatedSubworks);
        setreductions(updatedReductions);
        // setunits(response.data.subworks[0].default)
        // setSubworks(response.data.subworks[0].details);
        // console.log("subwork",subworks)
        setSubwname(response.data.subworks[0].name);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch subworks");
        setLoading(false);
      }
    };

    fetchSubworks();
  }, [wid, Token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToBatch = () => {
    const newSubwork = {
      id: Date.now().toString(), // Temporary unique ID
      ...formData,
      // totalval: formData.length * formData.breadth * formData.depth * formData.quantity,
    };
    setNewSubworks((prev) => [...prev, newSubwork]);
    setFormData({
      name: "",
      number: "1",
      length: "",
      breadth: "",
      depth: "",
      quantity: "1",
    });
  };

  const handleSubmitBatch = async () => {
    try {
      // console.log(newSubworks)
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/updateSubwork/${wid}`,
        { newDetails: newSubworks },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      // console.log(response.data.subwork.details)
      // setSubworks((prev) => [...prev, ...newSubworks]);
      setSubworks(response.data.subwork.details);
      setNewSubworks([]);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit subworks");
    }
  };
  const handleDeleteFromBatch = (id) => {
    setNewSubworks((prev) => prev.filter((subwork) => subwork.id !== id));
  };

  const handleDelete = async (detailId) => {
    try {
      let swid = wid;
      // console.log(`Deleting detail with ID: ${detailId} from Subwork ID: ${swid}`);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/deletesubworkfield/${swid}/${detailId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setSubworks(response.data.updatedSubwork.details);
    } catch (error) {
      console.error(
        "Error deleting subwork detail:",
        error.response?.data?.message || error.message
      );
    }
  };
  const handleDeleteReduction = async (detailId) => {
    try {
      let swid = wid;
      // console.log(`Deleting detail with ID: ${detailId} from Subwork ID: ${swid}`);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/deletesubworkreduction/${swid}/${detailId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setreductions(response.data.updatedSubwork.reductions);
      setSubworks(response.data.updatedSubwork.details);
    } catch (error) {
      console.error(
        "Error deleting subwork detail:",
        error.response?.data?.message || error.message
      );
    }
  };
  const handleEdit = (subwork) => {
    setEditingSubwork(subwork);
    setFormData({
      name: subwork.name,
      number: subwork.number,
      length: subwork.length,
      breadth: subwork.breadth,
      depth: subwork.depth,
      quantity: subwork.quantity,
    });
    setShowModal(true);
  };
  const handleReductionEdit = (reduction) => {
    setr(true);
    setEditingSubwork(reduction);
    setFormData({
      name: reduction.name,
      number: reduction.number,
      length: reduction.length,
      breadth: reduction.breadth,
      depth: reduction.depth,
      quantity: reduction.quantity,
    });
    setShowModal(true);
  };

  const handleUpdateReduction = async () => {
    try {
      console.log("editiong function isnide ");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/updateSubworkReduction/${wid}/${
          editingSubwork.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setSubworks(response.data.updatedSubwork.details);
      setreductions(response.data.updatedSubwork.reductions);
      setEditingSubwork(null);
      setShowModal(false);
      setFormData({
        name: "",
        number: "1",
        length: "",
        breadth: "",
        depth: "",
        quantity: "1",
      });
      setr(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subwork");
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/updateSubworkDetail/${wid}/${
          editingSubwork.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setSubworks(response.data.updatedSubwork.details);
      setEditingSubwork(null);
      setShowModal(false);
      setFormData({
        name: "",
        number: "1",
        length: "",
        breadth: "",
        depth: "",
        quantity: "1",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subwork");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/save-units/${wid}`,
        units,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setunits(response.data.updatedSubwork);
      if (response.data) {
        alert("Changes saved successfully!");
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      alert("An error occurred while saving changes");
      console.error("Error details:", error);
    }
  };

  const handleAddToReduction = async () => {
    const updatedFormData = {
      ...formData,
      length: parseFloat(formData.length) || 0,
      breadth: parseFloat(formData.breadth) || 0,
      depth: parseFloat(formData.depth) || 0,
      number: parseInt(formData.number, 10) || 1,
      quantity: parseInt(formData.quantity, 10) || 0,
    };

    setreductionform(updatedFormData);
    let newDetails = [updatedFormData];
    // setreductionform(formData);
    // let newDetails=[reductionform]

    // console.log("reductionform",newDetails)
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/addreductions/${wid}`,
      { newDetails: newDetails },
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    // console.log("reductionfrom",response.data.subwork.details)
    setSubworks(response.data.subwork.details);
    console.log("reductionform", response.data.subwork.reductions);
    setreductions(response.data.subwork.reductions);
    setFormData({
      name: "",
      number: "1",
      length: "",
      breadth: "",
      depth: "",
      quantity: "1",
    });
    // console.log("reductionform",reductions)
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between flex-wrap">
        <div className="">
          <h2 className="text-lg font-bold mb-4">Subwork: {subwname}</h2>
          <button
            onClick={() => navigate(-1)} // Navigate back
            className=" mx-1 bg-gray-500 text-white px-4 py-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          >
            Go Back
          </button>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setShowModal(true)}
          >
            Add Subwork
          </button>
        </div>
        <div className="flex flex-col space-y-4 justify-end mb-2 ">
          <div className="flex space-x-1">
            <label
              htmlFor="SFT"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16"
            >
              ₹ / SFT:
            </label>
            <input
              type="text"
              id="SFT"
              value={units.SFT}
              className="w-20 sm:w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              onChange={(e) => setunits({ ...units, SFT: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-1">
            <label
              htmlFor="CFT"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16"
            >
              ₹ / CFT:
            </label>
            <input
              type="text"
              id="CFT"
              value={units.CFT}
              className="w-20 sm:w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              onChange={(e) => setunits({ ...units, CFT: e.target.value })}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="py-2 px-6 bg-green-500 text-white rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">
              Add Subwork
            </h3>
            <form>
              {["name", "number", "length", "breadth", "depth"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              ))}
            </form>
            <div className="flex justify-between">
              <button
                className=" m-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className=" m-1 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded"
                onClick={handleAddToBatch}
              >
                Add to Batch
              </button>
              <button
                className=" m-1 px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded"
                onClick={handleAddToReduction}
              >
                Add to Deduction
              </button>
            </div>
            {newSubworks.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-black dark:text-white">
                  Batch Preview:
                </h4>
                <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700">
                  <ul>
                    {newSubworks.map((subwork, index) => (
                      <li
                        key={subwork.id}
                        className="flex justify-between items-center mb-2 text-black dark:text-gray-300"
                      >
                        <span>
                          {index + 1}. {subwork.name}
                        </span>
                        <button
                          className="px-2 py-1 text-white text-sm rounded"
                          onClick={() => handleDeleteFromBatch(subwork.id)}
                        >
                          <FaTrash
                            size={24}
                            className="text-red-500 hover:text-red-700 transition-all duration-300"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded"
                  onClick={handleSubmitBatch}
                >
                  Submit Batch
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}

      <div className="container mx-auto mt-8 ">
        <h3 className="font-bold mb-2">Main Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-900 dark:border-gray-300">
            <thead>
              <tr>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Serial No.
                </th>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Name
                </th>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Number
                </th>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Length (ft)
                </th>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Breadth (ft)
                </th>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Depth (ft)
                </th>
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Quantity
                </th>
                {/* <th className="border p-2">Total Value ₹</th> */}
                <th className="border p-2 border-gray-900 dark:border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subworks.map((subwork, index) => (
                <tr key={subwork.id}>
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {index + 1}
                  </td>
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {subwork.name}
                  </td>
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {subwork.number}
                  </td>
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {subwork.length}
                  </td>
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {subwork.breadth}
                  </td>
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {subwork.depth}
                  </td>
                  {/* <td className="border p-2">
                                {new Intl.NumberFormat('en-IN').format(
                                    subwork.quantity)
                                    }</td> */}
                  <td className="border p-2 border-gray-900 dark:border-gray-300">
                    {units.SFT != 0
                      ? subwork.length * subwork.breadth * subwork.number
                      : subwork.length *
                        subwork.breadth *
                        subwork.depth *
                        subwork.number}
                  </td>

                  {/* <td className="border p-2">{subwork.totalval}</td> */}
                  <td className="border border-collapse p-4 space-y-2 flex flex-col justify-center sm:flex-row sm:space-x-2 items-center border-gray-900 dark:border-gray-300">
                    <button
                      className=" text-white rounded mb-1 sm:mb-0"
                      onClick={() => handleEdit(subwork)}
                    >
                      <FaEdit
                        size={24}
                        className="text-blue-400 dark:text-white"
                      />
                    </button>
                    <button
                      className=" text-white rounded"
                      onClick={() => handleDelete(subwork.id)}
                    >
                      <FaTrash
                        size={24}
                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                      />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className=""> </td>
                <td className=""> </td>
                <td className=""> </td>
                <td className=""> </td>
                <td className=""> </td>
                <td className="border p-2 font-bold border-gray-900 dark:border-gray-300">
                  {" "}
                  total quantity
                </td>
                <td className="border p-2 font-bold border-gray-900 dark:border-gray-300 ">
                  {" "}
                  {new Intl.NumberFormat("en-IN").format(totalQuantity)}
                </td>
                <td className=""> </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className=" mt-[2vw] overflow-x-auto">
        <div>
          <h1>
            <strong>Deduction Table</strong>{" "}
          </h1>
        </div>
        <table className="min-w-full border-collapse border border-gray-900 dark:border-gray-300">
          <thead>
            <tr>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Serial No.
              </th>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Name
              </th>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Number
              </th>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Length (ft)
              </th>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Breadth (ft)
              </th>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Depth (ft)
              </th>
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Quantity
              </th>
              {/* <th className="border p-2">Total Value ₹</th> */}
              <th className="border p-2 border-gray-900 dark:border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reductions.map((reduction, index) => (
              <tr key={reduction.id}>
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {index + 1}
                </td>
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {reduction.name}
                </td>
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {reduction.number}
                </td>
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {reduction.length}
                </td>
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {reduction.breadth}
                </td>
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {reduction.depth}
                </td>
                {/* <td className="border p-2">
                                {new Intl.NumberFormat('en-IN').format(
                                    subwork.quantity)
                                    }</td> */}
                <td className="border p-2 border-gray-900 dark:border-gray-300">
                  {units.SFT != 0
                    ? reduction.length * reduction.breadth * reduction.number
                    : reduction.length *
                      reduction.breadth *
                      reduction.depth *
                      reduction.number}
                </td>

                {/* <td className="border p-2">{subwork.totalval}</td> */}
                <td className="border p-4 space-y-2 flex flex-col justify-center sm:flex-row sm:space-x-2 items-center border-gray-900 dark:border-gray-300">
                  <button
                    className="px-2 py-1 text-white rounded mb-1 sm:mb-0"
                    onClick={() => handleReductionEdit(reduction)}
                  >
                    <FaEdit
                      size={24}
                      className="text-blue-400 dark:text-white"
                    />
                  </button>
                  <button
                    className="px-2 py-1 text-white rounded"
                    onClick={() => handleDeleteReduction(reduction.id)}
                  >
                    <FaTrash
                      size={24}
                      className="text-red-500 hover:text-red-700 transition-all duration-300"
                    />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className=""> </td>
              <td className=""> </td>
              <td className=""> </td>
              <td className=""> </td>
              <td className=""> </td>
              <td className="border p-2 font-bold border-gray-900 dark:border-gray-300">
                {" "}
                total Reduction quantity
              </td>
              <td className="border p-2 font-bold border-gray-900 dark:border-gray-300">
                {" "}
                {new Intl.NumberFormat("en-IN").format(RtotalQuantity)}
              </td>
              <td className=""> </td>
            </tr>
            <tr>
              <td className=""> </td>
              <td className=""> </td>
              <td className=""> </td>
              <td className=""> </td>
              <td className=""> </td>
              <td className="border p-2 font-bold border-gray-900 dark:border-gray-300">
                {" "}
                Amount total
              </td>

              <td className="border p-2 font-bold border-gray-900 dark:border-gray-300">
                ₹{" "}
                {new Intl.NumberFormat("en-IN").format(
                  units.SFT !== 0
                    ? (totalQuantity - RtotalQuantity) * units.SFT
                    : (totalQuantity - RtotalQuantity) * units.CFT
                )}
              </td>
              <td className="border p-2 border-gray-900 dark:border-gray-300">
                {" "}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showModal && editingSubwork && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">
              Edit Subwork
            </h3>
            <form>
              {["name", "number", "length", "breadth", "depth"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              ))}
            </form>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                onClick={() => {
                  setEditingSubwork(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded"
                onClick={() => {
                  r ? handleUpdateReduction() : handleUpdate();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VIewSubworks;
