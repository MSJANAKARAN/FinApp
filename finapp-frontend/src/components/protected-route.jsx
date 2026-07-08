import { Navigate } from "react-router-dom";
import AuthService from "../framework/services/auth-services";
import { Children } from "react";

function ProtectedRoute({children}) {
    return AuthService.isLoggedIn() ? children : <Navigate to='/' />

}

export default ProtectedRoute;