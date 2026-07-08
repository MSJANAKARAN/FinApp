import { Link, useNavigate } from "react-router-dom";
import AuthService from "../framework/services/auth-services";

function Navbar({ title }) {
    const navigate = useNavigate();

    const logout = () => {
        AuthService.logout(); // Remove JWT/localStorage
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/dashboard">
                    <img
                        src="src/assets/logo_2x1.png"
                        alt="FINAPP"
                        style={{ height: '40px', width: 'auto', display: 'block' }}
                    />
                </Link>
               <div className="ms-auto">
                      <h2 className="text-white">
                    {title}
                </h2>
                   
                </div>
                <div className="ms-auto">
                     
                    <Link className="btn btn-outline-light me-2" to="/dashboard">
                        Dashboard
                    </Link>

                    <Link className="btn btn-outline-light me-2" to="/expenses">
                        Expenses
                    </Link>
                    <Link className="btn btn-outline-light me-2" to="/portfolio">
                        Portfolio
                    </Link>

                    <button className="btn btn-danger" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;