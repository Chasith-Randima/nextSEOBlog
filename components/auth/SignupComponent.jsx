import { useState, useEffect } from "react";
import { signup, isAuth } from "../../actions/auth";
import Router from "next/router";
import Link from "next/link";

// signup compoenent
const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "Randima",
    email: "randima@gmail.com",
    password: "randima",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  useEffect(() => {
    if (isAuth()) {
      Router.push(`/`);
    }
  }, []);

  const { name, email, password, error, loading, message, showForm } = values;
  const handleSubmit = (e) => {
    e.preventDefault();

    setValues({ ...values, loading: true, error: false });

    const user = { name, email, password };

    signup(user).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: data.message,
          showForm: false,
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };
  let showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";
  let showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  let showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  let signupForm = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              value={name}
              type="text"
              className="form-control"
              placeholder="Type your name"
              onChange={handleChange("name")}
            />
          </div>
          <div className="form-group">
            <input
              value={email}
              type="email"
              className="form-control"
              placeholder="Type your email"
              onChange={handleChange("email")}
            />
          </div>
          <div className="form-group">
            <input
              value={password}
              type="password"
              className="form-control"
              placeholder="Type your password"
              onChange={handleChange("password")}
            />
          </div>
          <div>
            <button className="btn btn-primary">Signup</button>
          </div>
        </form>
      </>
    );
  };
  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
      <br />
      <Link href={"/auth/password/forgot"}>
        <a className="btn btn-outline-danger btn-sm">Forgot Password</a>
      </Link>
    </>
  );
};

export default SignupComponent;
