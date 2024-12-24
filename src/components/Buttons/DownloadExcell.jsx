import React, { useState } from "react";
import { FaFileExcel } from "react-icons/fa";

const DownloadExcell = ({ wid, Token }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true); // Set loading state to true

    try {
      console.log("Download button clicked");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/subwork-xcell-generate/${wid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`, // Replace with your token
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link to download the file
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "subwork_report.xlsx"; // Set file name to Excel
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert("Failed to download Excel. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-2 py-2 "
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="loader border-4 border-t-transparent border-white rounded-full w-6 h-6 animate-spin"></div>
        </div>
      ) : (
        <span className="flex items-center">
          <FaFileExcel color="green" size={20} className="mr-2" />
          
        </span>
      )}
    </button>
  );
};

export default DownloadExcell;
