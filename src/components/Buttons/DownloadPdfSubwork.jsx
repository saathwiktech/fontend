import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
const DownloadPdfSubwork = ({ wid, Token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);

    try {
      // console.log("clicked");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/subwork-pdf-generate/${wid}`,
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
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "invoice.pdf";
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        // alert('PDF downloaded successfully!');
      } else {
        alert("Failed to download PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} className="" disabled={isLoading}>
      {isLoading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="loader border-4 border-t-transparent border-white dark:border-gray-800 dark:border-t-gray-300 rounded-full w-6 h-6 animate-spin"></div>
        </div>
      ) : (
        <span>
          <FaFilePdf size={24} className="text-red-800" />
        </span>
      )}
    </button>
  );
};

export default DownloadPdfSubwork;
