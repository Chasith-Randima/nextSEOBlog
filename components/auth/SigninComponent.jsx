import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
// import LoginGoogle from "./loginGoogle";

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: "randima@gmail.com",
    password: "1234567890",
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

  const { email, password, error, loading, message, showForm } = values;
  const handleSubmit = async (e) => {
    e.preventDefault();

    setValues({ ...values, loading: true, error: false });

    const user = { email, password };

    await signin(user).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            Router.push(`/admin`);
          } else {
            Router.push(`/user`);
          }
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

  let signinForm = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
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
            <button className="btn btn-primary">Signin</button>
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
      {/* login using google option  */}
      {/* <LoginGoogle /> */}
      {showForm && signinForm()}
      <br />
      <Link href={"/auth/password/forgot"}>
        <a className="btn btn-outline-danger btn-sm">Forgot Password</a>
      </Link>
    </>
  );
};

export default SigninComponent;
