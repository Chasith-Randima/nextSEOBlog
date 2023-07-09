import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <div>

      <p>Footer</p>
      </div>
    </>
  );
};

export default Layout;
