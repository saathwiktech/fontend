// src/App.jsx
import AppRouter from './router/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">
       <ToastContainer />
      <AppRouter />
    </div>
  );
}

export default App;
