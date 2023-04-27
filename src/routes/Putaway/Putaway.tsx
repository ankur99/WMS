import { Link } from "react-router-dom";

const Putaway = () => {
  return (
    <>
      <h2>Welcome to Putaway Page</h2>
      <Link to="/home/putaway/putaway-assignment">Fresh Putaway Assignment</Link>
      <hr />
      <Link to="/home/putaway/putaway-report">Putaway Report</Link>
      <hr />
      <Link to="/home/putaway/return-putaway">Return Putaway</Link>
    </>
  );
};

export default Putaway;
