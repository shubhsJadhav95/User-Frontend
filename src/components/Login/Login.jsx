import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";

const Login = () => {

  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext);

  const [data, setData] = useState({
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
      const loginData = await login(data);

      if (loginData.token) {
        setToken(loginData.token);
        localStorage.setItem("token", loginData.token);

        toast.success("Login successful");

        setData({
          email: "",
          password: ""
        });

        navigate("/home");
      } else {
        toast.error("Unable to login. Please try again.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  const onResetHandler = () => {
    setData({
      email: "",
      password: ""
    });
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">

          <div className="card border-0 shadow rounded-3 my-5">

            <div className="card-body p-4 p-sm-5">

              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign In
              </h5>

              <form onSubmit={onSubmitHandler}>

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
                  <label htmlFor="floatingEmail">Email address</label>
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

                {/* Login Button */}
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign In
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

                {/* Register Link */}
                <div className="mt-4 text-center">
                  Don't have an account?{" "}
                  <Link to="/register">Sign Up</Link>
                </div>

              </form>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;