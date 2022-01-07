import React from "react";

const FBSwimmingTotals: React.FC<{}> = () => (
  <div className={`ytd-totals profile-boxes`}>
    <h4 className="ytd-totals-title">Year-To-Date Swim Totals</h4>
    <p className="ytd-descriptor">Number of Swims: Loading...</p>
    <p className="ytd-descriptor">Total Distance: Loading...</p>
    <p className="ytd-descriptor">Average Speed: Loading...</p>
  </div>
);

export default FBSwimmingTotals;
