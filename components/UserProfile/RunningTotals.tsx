import React from "react";
import style from "../../styles/App.module.scss";
import { RunningTotalsSection } from "./UserProfileTypes";

const RunningTotals: React.FC<RunningTotalsSection> = ({
  profile: { ytd_run_totals }
}) => {
  return (
    <div className={`${style.ytdTotals} ${style.profileBoxes}`}>
      <h4 className={style.ytdTotalsTitle}>Year To Date Run Totals</h4>
      <p className={style.ytdDescriptor}>Number of Runs: {ytd_run_totals.count}</p>
      <p className={style.ytdDescriptor}>Total Distance: {ytd_run_totals.distance} Meters</p>
      <p className={style.ytdDescriptor}>
        {`Average Speed: `}
        {ytd_run_totals.count === 0
          ? 0
          : (ytd_run_totals.distance / ytd_run_totals.elapsed_time).toFixed(2)}{" "}
        Meters per Second
      </p>
    </div>
  );
};

export default RunningTotals;
