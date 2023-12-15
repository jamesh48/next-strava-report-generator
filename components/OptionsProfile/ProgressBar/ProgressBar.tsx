import React from "react";
import axios from "axios";
import { useProgressBarProgressStore } from "./useProgressBarProgress";
import { useInterval } from "./useInterval";
import { useGlobalContext } from "../../GlobalStore/globalStore.js";
import { ProgressBarProps } from "./ProgressBarTypes";
import progressBarStyles from "../../../styles/progressBar.module.scss";

const ProgressBar: React.FC<ProgressBarProps> = () => {
  const [{ isLoaded }, globalDispatch] = useGlobalContext();
  const {
    progressBarProgress,
    incrementProgressBarProgress,
    completeProgressBarProgress,
    resetProgressBarProgress
  } = useProgressBarProgressStore((state) => state);

  useInterval(
    () => {
      if (isLoaded) {
        completeProgressBarProgress();
        setTimeout(() => {
          resetProgressBarProgress();
        }, 750);
      } else if (isLoaded === false) {
        incrementProgressBarProgress();
      }
    },
    isLoaded === true || isLoaded === null ? -1 : 75
  );

  const fillerStyles = {
    width: `${progressBarProgress}%`
  };

  const updateEntries: () => Promise<void> = async () => {
    globalDispatch({ type: "TOGGLE LOADED OFF" });
    const { data: allActivities } = await axios.post("/api/addAllActivities");
    globalDispatch({ type: "TOGGLE LOADED ON" });
    globalDispatch({
      type: "SET TOTAL ENTRIES",
      payload: allActivities
    });
  };

  const setSortCondition: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    globalDispatch({
      type: "SET SORT CONDITION",
      payload: event.currentTarget.value
    });
  };

  const destroyUser: React.MouseEventHandler<HTMLInputElement> = async () => {
    await axios.delete("/destroy-user");
  };

  return progressBarProgress === 0 ? (
    <div className={progressBarStyles.updateButtonContainer}>
      <select className={progressBarStyles.updateButton} onChange={setSortCondition}>
        <option value="speedDesc">Speed: Fastest First</option>
        <option value="dateDesc">Date: Most Recent</option>
        <option value="dateAsc">Date: Least Recent</option>
        <option value="movingTimeDesc">Moving Time: Longest First</option>
        <option value="movingTimeAsc">Moving Time: Shortest First</option>
        <option value="timeElapsedDesc">Time Elapsed: Longest First</option>
        <option value="timeElapsedAsc">Time Elapsed: Shortest First</option>
      </select>
      <input
        type="button"
        className={progressBarStyles.updateButton}
        value="Update!"
        onClick={updateEntries}
      />
      <input
        type="button"
        className={progressBarStyles.updateButton}
        value="Destroy!"
        onClick={destroyUser}
      />
    </div>
  ) : (
    <div className={progressBarStyles.updateButtonContainer}>
      <div id={progressBarStyles.progressBarContainer}>
        <div className={progressBarStyles.progressBarFiller} style={fillerStyles}>
          <span
            className={progressBarStyles.progressBarCounter}
          >{`${progressBarProgress}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
