import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Dashboard from "./pages/dashboard";
import Expense from "./pages/expense";
import Login from "./pages/login";
import Portfolio from "./pages/portfolio";
import Register from "./pages/register";

function AppRoutes() {

  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.removeItem("token");
      sessionStorage.clear();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="login">
              <Login />
            </div>
          }
        />

        <Route
          path="/register"
          element={
            <div className="login">
              <Register />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="dashboard">
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <div className="expense">
                <Expense />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/portfolio" element={
          <div className="portfolio">
            <Portfolio />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;