import { useState } from "react";
import { login } from "../api/auth";
import AuthService from "../framework/services/auth-services"
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        email: "",
        password: ""
    });

    const handleChange = e => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async e => {

        e.preventDefault();

        try {

            const response =
                await login(form);

            AuthService.saveToken(
                response.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            alert("Login Failed" + error);
        }
    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body">

                            <h3>FinApp Login</h3>

                            <form
                                onSubmit={
                                    handleSubmit
                                }>
                                <div className="mb-3 text-start">
                                    <label htmlFor="email" className="form-label">
                                        Enter Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3 text-start">
                                    <label htmlFor="password" className="form-label">
                                        Enter Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Password"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>

                                    <button
                                        className="btn btn-primary w-100">

                                        Login

                                    </button>
                                </div>


                                <div className="mt-3 text-center">

                                    Don't have an account?

                                    <Link
                                        to="/register"
                                        className="ms-2">

                                        Register

                                    </Link>

                                </div>
                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;