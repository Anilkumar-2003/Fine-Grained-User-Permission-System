import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employee";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee"
import AssignPermissions from "./pages/AssignPermissions";

import MainLayout from "./layouts/Mainlayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import Profile from "./pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Employees />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/assign-permissions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AssignPermissions />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      <Route path="/add-employee" element={
        <ProtectedRoute>
          <MainLayout>
            <AddEmployee />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route
        path="/edit-employee/:email"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditEmployee />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}