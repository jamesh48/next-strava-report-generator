import React from "react";
import { AdditionalFilterProps } from "../RadioTypes";
import additionalFilterStyles from "../../../../styles/additionalFilters.module.scss";

const AdditionalFilters: React.FC<AdditionalFilterProps> = (props) => {
  return (
    <div className={additionalFilterStyles.additionalFilters}>
      <span className={additionalFilterStyles.additionalFilterContainer}>
        <span className={additionalFilterStyles.dateFilter}>
          <label>From...</label>
          <input
            className={additionalFilterStyles.additionalFilter}
            type="date"
            onChange={props.setFromDateQuery}
          />
        </span>
        <span className={additionalFilterStyles.dateFilter}>
          <label>To...</label>
          <input
            className={additionalFilterStyles.additionalFilter}
            type="date"
            onChange={props.setToDateQuery}
          />
        </span>
      </span>
      <span className={additionalFilterStyles.additionalFilterContainer}>
        <input
          className={additionalFilterStyles.additionalFilter}
          placeholder="Title Includes..."
          onChange={props.setTitleQuery}
          value={props.titleQuery}
          type="text"
        />
      </span>
    </div>
  );
};

export default AdditionalFilters;
