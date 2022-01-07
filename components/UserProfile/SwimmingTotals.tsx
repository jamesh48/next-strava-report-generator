import React from "react";
import style from "../../styles/App.module.scss";
import { SwimmingTotalsSection } from "./UserProfileTypes";

const SwimmingTotals: React.FC<SwimmingTotalsSection> = ({
  profile: { ytd_swim_totals }
}) => {
  return (
    <div className={`${style.ytdTotals} ${style.profileBoxes}`}>
      <h4 className={style.ytdTotalsTitle}>Year-To-Date Swim Totals</h4>
      <p className={style.ytdDescriptor}>Number of Swims: {ytd_swim_totals.count}</p>
      <p className={style.ytdDescriptor}>
        Total Distance: {ytd_swim_totals.distance} Meters
      </p>
      <p className={style.ytdDescriptor}>
        {`Average Speed: `}
        {ytd_swim_totals.count !== 0
          ? (ytd_swim_totals.distance / ytd_swim_totals.elapsed_time).toFixed(2)
          : 0}{" "}
        Meters per Second
      </p>
    </div>
  );
};

export default SwimmingTotals;
