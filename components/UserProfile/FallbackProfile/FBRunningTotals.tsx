import React from "react";

const FBRunningTotals: React.FC<{}> = () => (
  <div className={`ytd-totals profile-boxes`}>
    <h4 className="ytd-totals-title">Year-To-Date Run Totals</h4>
    <p className="ytd-descriptor">Number of Runs: Loading...</p>
    <p className="ytd-descriptor">Total Distance: Loading...</p>
    <p className="ytd-descriptor">Average Speed: Loading...</p>
  </div>
);

export default FBRunningTotals;
