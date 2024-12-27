// import React, { useEffect, useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import {
//   FiHome,
//   FiUser,
//   FiSettings,
//   FiBarChart,
//   FiLogOut,
//   FiMenu,
//   FiX,
//   FiBook
// } from "react-icons/fi";

// import { useAuth } from '../context/AuthContext.jsx';
// import ProjectList from "./dashboard/ProjectList.jsx";
// const DashboardPage = () => {

//   const { login,isLoggedIn, setuSerData,user } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeItem, setActiveItem] = useState("Projects");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const logs = localStorage.getItem("logs");
//     if (logs === "false" || logs == null) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const menuItems = [
//     { id: "Projects", icon: <FiBarChart />, label: "Projects",path: `/dashboard/projects` },
//     { id: "Dashboard", icon: <FiHome />, label: "Dashboard", path: "/dashboard" },
//     // { id: "Settings", icon: <FiSettings />, label: "Settings",path: "/dashboard/settings" },
//     // { id: "Default", icon: <FiBook />, label: "Default",path: "/dashboard/default" },
//     { id: "Profile", icon: <FiUser />, label: "Profile", path: "/dashboard/profile" },
//     // { id: "Logout", icon: <FiLogOut />, label: "Logout",path: "/dashboard" },
//   ];

//   const renderContent = () => {
//     if (activeItem === "Dashboard") {
//       return (
//         <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
//           <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
//             Welcome to Your Dashboard
//           </h2>
//           <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
//             Here you can manage your account, view notifications, and much more.
//           </p>
//           <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg">
//             <h3 className="text-xl font-bold text-black dark:text-white">
//               Your Information
//             </h3>
//             <ul className="mt-4 text-black dark:text-white">
//               <li className="mb-2">Name: John Doe</li>
//               <li className="mb-2">Email:</li>
//               <li className="mb-2">Joined: January 2024</li>
//             </ul>
//           </div>
//         </div>
//       );
//     } else if (activeItem === "Projects") {
//       return <><ProjectList/></>;
//     } else if (activeItem === "Settings") {
//       return <p>Customize your Settings.</p>;
//     } else if (activeItem === "Profile") {
//       return <p>View and edit your Profile.</p>;
//     } else if (activeItem === "Logout") {
//       localStorage.removeItem("logs");
//       console.log("Logges out gijigiji");
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="min-h-screen  transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }
//           bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0`}
//       >
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold">My Dashboard</h2>
//           <button onClick={toggleSidebar} className="lg:hidden">
//             <FiX size={24} />
//           </button>
//         </div>
//         <nav className="p-4">
//           {menuItems.map((item) => (
//             // <Link
//             //   key={item.id}
//             //   onClick={() => setActiveItem(item.id)}
//             //   className={`flex items-center px-4 py-3 w-full text-left rounded-lg space-x-3 my-1 ${
//             //     activeItem === item.id
//             //       ? "bg-gray-200 dark:bg-gray-700"
//             //       : "hover:bg-gray-100 dark:hover:bg-gray-700"
//             //   }`}
//             // >
//             //   {item.icon}
//             //   <span>{item.label}</span>
//             // </Link>
//             <Link
//             key={item.id}
//             to={item.path}
//             className={`flex items-center px-4 py-3 w-full text-left rounded-lg space-x-3 my-1 ${
//               location.pathname === item.path
//                 ? "bg-gray-200 dark:bg-gray-700"
//                 : "hover:bg-gray-100 dark:hover:bg-gray-700"
//             }`}
//           >
//             {item.icon}
//             <span>{item.label}</span>
//           </Link>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <header className="flex justify-between items-center px-6 py-0 bg-white dark:bg-gray-800 shadow-md">
//           <button onClick={toggleSidebar} className="lg:hidden">
//             <FiMenu size={24} />
//           </button>
//         </header>
//         <main className="flex-1 p-6">
//           {/* <h1 className="text-2xl font-bold mb-6">{activeItem}</h1>
//           <div>{renderContent()}</div> */}

//           <Outlet/>
//         </main>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;

import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logs = localStorage.getItem("logs");
    if (logs === "false" || logs == null) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
