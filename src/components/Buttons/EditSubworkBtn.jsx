import React, { useState } from "react";
import { FaEdit } from 'react-icons/fa';

function EditSubworkBtn({ wid, Token }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
        <button className="edit-button"  onClick={() => setIsOpen(true)}>
            <span>
                <FaEdit size={25} className="text-blue-800 dark:text-white " />
            </span>
        </button>

        {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Subwork</h2>
            
            {/* Example Input Field */}
            <input
              type="text"
              placeholder="Enter new subwork name"
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    );
}

export default EditSubworkBtn;