import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import ProjectList from "./dashboard/ProjectList.jsx";
import Sidebar from "../components/Sidebar.jsx";

const DashboardPage = () => {
  const { isLoggedIn, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const logs = localStorage.getItem("logs");
    if (logs === "false" || logs == null) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("logs");
    navigate("/login");
  };

  const renderContent = () => {
    if (activeItem === "Dashboard") {
      return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
            Welcome to Your Dashboard
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Here you can manage your account, view notifications, and much more.
          </p>
          <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-black dark:text-white">
              Your Information
            </h3>
            <ul className="mt-4 text-black dark:text-white">
              <li className="mb-2">Name: John Doe</li>
              <li className="mb-2">Email:</li>
              <li className="mb-2">Joined: January 2024</li>
            </ul>
          </div>
        </div>
      );
    } else if (activeItem === "Projects") {
      return <><ProjectList /></>;
    } else if (activeItem === "Settings") {
      return <p>Customize your Settings.</p>;
    } else if (activeItem === "Profile") {
      return <p>View and edit your Profile.</p>;
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-0 bg-white dark:bg-gray-800 shadow-md">
          <button onClick={toggleSidebar} className="lg:hidden">
            <FiMenu size={24} />
          </button>
        </header>
        <main className="flex-1 ">
          <h1 className="text-2xl font-bold mb-6">{activeItem}</h1>
          <div>{renderContent()}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardPage;
