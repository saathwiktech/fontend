import { useLocation } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { id: "Dashboard", path: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { id: "Projects", path: "/dashboard/projects", icon: <FiBarChart />, label: "Projects" },
    { id: "Settings", path: "/dashboard/settings", icon: <FiSettings />, label: "Settings" },
    { id: "Profile", path: "/dashboard/profile", icon: <FiUser />, label: "Profile" },
    { id: "Logout", path: "/login", icon: <FiLogOut />, label: "Logout" },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } 
      bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">My Dashboard</h2>
        <button onClick={toggleSidebar} className="lg:hidden">
          <FiX size={24} />
        </button>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center px-4 py-3 w-full text-left rounded-lg space-x-3 my-1 ${
              location.pathname === item.path
                ? "bg-gray-200 dark:bg-red-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
