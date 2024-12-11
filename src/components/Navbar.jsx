import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaUserAlt, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa'; // React Icons
import { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(true);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 
  const closeMenuOnClickOutside = (e) => {
    if (e.target.classList.contains('overlay')) {
      setIsMenuOpen(false);
    }
  };
  const logoutfn =()=>{
    logout()
    // navigate('/login')
}

  useEffect(() => {
    document.body.addEventListener('click', closeMenuOnClickOutside);

    return () => {
      document.body.removeEventListener('click', closeMenuOnClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">

        <div>
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            Civigo
          </Link>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-800 dark:text-white">
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-gray-800 dark:text-white flex items-center space-x-1 hover:text-blue-500">
                <FaSignInAlt className="text-lg" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="text-gray-800 dark:text-white flex items-center space-x-1 hover:text-blue-500">
                <FaUserAlt className="text-lg" />
                <span>Signup</span>
              </Link>
            </>
          ) : (
            <button
              onClick={logoutfn}
              className="text-gray-800 dark:text-white flex items-center space-x-1 hover:text-blue-500"
            >
              <FaSignInAlt className="text-lg" />
              <span>Logout</span>
            </button>
          )}

          <DarkModeToggle />
        </div>
        <div
          className={`overlay ${isMenuOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 z-10 transition-all duration-300`}
          onClick={toggleMenu}
        >
          <div className="flex justify-end p-6">
            <button onClick={toggleMenu} className="text-white">
              <FaTimes className="text-3xl" />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-4 text-white text-lg">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="flex items-center space-x-1" onClick={toggleMenu}>
                  <FaSignInAlt className="text-xl" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-1" onClick={toggleMenu}>
                  <FaUserAlt className="text-xl" />
                  <span>Signup</span>
                </Link>
              </>
            ) : (
              <button onClick={()=>{logout(); toggleMenu();}} className="flex items-center space-x-1" >
                <FaSignInAlt className="text-xl" />
                <span>Logout</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
