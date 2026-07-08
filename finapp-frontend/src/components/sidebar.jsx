import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <NavLink to="/dashboard"><i className="bi bi-speedometer2"></i> Dashboard</NavLink>
            <NavLink to="/expenses"><i className="bi bi-wallet2"></i> Expenses</NavLink>
            <NavLink to="/portfolio"><i className="bi bi-graph-up"></i> Portfolio</NavLink>
            <NavLink to="/budgets"><i className="bi bi-piggy-bank"></i> Budgets</NavLink>
            <NavLink to="/analytics"><i className="bi bi-bar-chart"></i> Analytics</NavLink>
        </div>
    );
}

export default Sidebar;