import Link from "next/link";
import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";

const UserIndex = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>User Dashboard</h2>
          </div>
          <div className="col-md-4">
            <ul className="list-group">
              <li className="list-group-item">
                <a href="/user/crud/blog"> Create Blog</a>

                {/* <Link href="/admin/crud/blog">
                    <a> Create Blog</a>
                  </Link> */}
              </li>
              <li className="list-group-item">
                <Link href="/user/crud/blogs">
                  <a> Update/Delete Blog</a>
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/user/update">
                  <a>Update Profile</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">right</div>
        </div>
      </div>
    </Layout>
  );
};

export default UserIndex;
