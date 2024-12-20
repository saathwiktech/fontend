import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
const DownloadPdfSubwork = ({ wid, Token }) => {
  const [isLoading, setIsLoading] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleClick = async () => {
    setIsLoading(true); // Set loading state to true

    try {
      // Adding delay before making the server call
      //   await delay(1000);  // Wait for 1 second before proceeding
        console.log("clicked");
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

        // Create a link to download the file
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

      // Simulate a server request (you can replace this with an actual API call)
      // const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      // const data = await response.json();
      // console.log(data);  // Handle your response here
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
          <div className="loader border-4 border-t-transparent border-white rounded-full w-6 h-6 animate-spin"></div>
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
