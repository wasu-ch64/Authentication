import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "./components/Loginpage";
import Registerpage from "./components/Registerpage";
import Home from "./Pages/Home";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";
import { useAuthStore } from "./store/authStore";
import Adminpage from "./Admin/Admin";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to={role === 'admin' ? '/admin' : '/home'} replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Loginpage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Registerpage />
            </GuestRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole={null}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Adminpage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;