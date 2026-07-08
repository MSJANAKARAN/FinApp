import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setMessage("");

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,12}$/;

        if (!passwordRegex.test(form.password)) {

            setError(
                "Password must contain uppercase, lowercase, number and special character."
            );

            return;
        }

        if (form.password !== form.confirmPassword) {

            setError(
                "Password and Confirm Password do not match."
            );

            return;
        }
        if (form.password.length < 8) {

            setError(
                "Password must be at least 8 characters."
            );

            return;
        }

        try {
            const payload = {

                fullName: form.fullName,
                email: form.email,
                password: form.password
            };
            const response =
                await register(payload);

            setMessage(
                response.data.message ||
                "Registration Successful"
            );

            setTimeout(() => {

                navigate("/");

            }, 1000);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h3 className="mb-4">
                                Create FinApp Account
                            </h3>

                            {
                                error &&
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            }

                            {
                                message &&
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            }
                            <form
                                onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full Name"
                                        className="form-control mb-3"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="form-control mb-3"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        min="8" max="12"
                                        className="form-control mb-3"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div> <input
                                    type="password"
                                    name="confirmPassword"
                                    min="8" max="12"
                                    placeholder="Confirm Password"
                                    className="form-control mb-3"
                                    onChange={handleChange}
                                    required
                                />
                                </div>
                                    {
                                        form.confirmPassword &&
                                        (
                                            form.password.length>=8 ? form.password === form.confirmPassword
                                                ?
                                                <small className="text-success">
                                                    Passwords match
                                                </small>
                                                :
                                                <small className="text-danger">
                                                    Passwords do not match
                                                </small>
                                                : <small className="text-danger">
                                                    Password length must be atleast 8
                                                </small>
                                        )
                                    }
                                
                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-success w-100">

                                        Register

                                    </button>
                                </div>


                            </form>

                            <div className="mt-3 text-center">

                                Already have an account?

                                <Link
                                    to="/"
                                    className="ms-2">

                                    Login

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            <ul className="left">
                <strong>Password Combinations:</strong>
                <li>Password must be 8 to 12 characters.</li>
                <li>Password must contain uppercase, lowercase, number and special character.</li>
            </ul>
        </div>
    );
}

export default Register;