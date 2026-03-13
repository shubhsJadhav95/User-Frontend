import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";

const Register = () => {
  

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await registerUser(data);
      toast.success("Registration completed. Please login!");

      setData({
        name: "",
        email: "",
        password: ""
      });

      navigate("/login");

    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const onResetHandler = () => {
    setData({
      name: "",
      email: "",
      password: ""
    });
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">

              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign Up
              </h5>

              <form onSubmit={onSubmitHandler}>

                {/* Full Name */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Full Name"
                    name="name"
                    value={data.name}
                    onChange={onChangeHandler}
                    required
                  />
                  <label htmlFor="floatingName">Full Name</label>
                </div>

                {/* Email */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />
                  <label htmlFor="floatingEmail">Email Address</label>
                </div>

                {/* Password */}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                {/* Sign Up Button */}
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Reset Button */}
                <div className="d-grid">
                  <button
                    className="btn btn-danger btn-login text-uppercase mt-2"
                    type="button"
                    onClick={onResetHandler}
                  >
                    Reset
                  </button>
                </div>

                {/* Login Link */}
                <div className="mt-4 text-center">
                  Already have an account?{" "}
                  <Link to="/login">Sign In</Link>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;