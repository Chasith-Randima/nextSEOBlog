import Link from "next/link";
import Layout from "../components/Layout";
import SignupComponent from "../components/auth/SignupComponent.jsx";
import { useEffect } from "react";
import { isAuth } from "../actions/auth";
import Router from "next/router";

const Signup = () => {
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Signup page</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SignupComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
