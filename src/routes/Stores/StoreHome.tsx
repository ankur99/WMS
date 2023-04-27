import useRedirection from "../../hooks/useRedirection";

const StoreHome = () => {
  const url = process.env.REACT_APP_OLD_ADMIN_APP_URL + "/stores";
  useRedirection(url);
  return <h1 style={{ textAlign: "center" }}>Redirecting...</h1>;
};

export default StoreHome;
