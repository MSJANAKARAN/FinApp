import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Expense from "./pages/expense";
import Portfolio from "./pages/portfolio";

function AppRoutes() {
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