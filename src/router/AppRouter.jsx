// src/router/AppRouter.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DashboardPage from "../pages/DashboardPage";
import Navbar from "../components/Navbar";
import WorkList from "../pages/dashboard/WorkList";
import SubWorkList from "../pages/dashboard/SubWorkList";
import ProjectList from "../pages/dashboard/ProjectList";

import Profile from "../pages/dashboard/Profile";
import Projects from "../pages/dashboard/Projects";
import Settings from "../pages/dashboard/Settings";
import DefaultValues from "../pages/DefaultValues";
import VIewSubworks from "../pages/dashboard/VIewSubworks";
const AppRouter = () => {
  return (
    <>
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />

          <Route path="/dashboard/*" element={<DashboardPage />}>
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:pid" element={<WorkList />} />
            <Route path="projects/works/:wid" element={<SubWorkList />} />
            <Route
              path="projects/works/subwork/:wid"
              element={<VIewSubworks />}
            />
            <Route path="default" element={<DefaultValues />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default AppRouter;
