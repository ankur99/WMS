import useRedirection from "../../hooks/useRedirection";

const AllStore = () => {
  const url = process.env.REACT_APP_OLD_ADMIN_APP_URL + "/stores";
  useRedirection(url);
  return <h1 style={{ textAlign: "center" }}>Redirecting...</h1>;
};

export default AllStore;
