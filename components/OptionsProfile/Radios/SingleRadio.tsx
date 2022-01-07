import React from "react";
import { SingleRadioProps } from "./RadioTypes";
import appStyles from "../../../styles/App.module.scss";

const SingleRadio: React.FC<SingleRadioProps> = (props) => {
  return props.type === "radio" ? (
    <div className={appStyles.singleRadioButtonContainer}>
      <input
        defaultChecked={props.index === 0}
        disabled={!props.isLoaded ? true : false}
        type={props.type}
        id={props.id}
        name={props.name}
        value={props.value}
        // @ts-ignore
        checked={
          props.name.indexOf("distance") > -1 && props.index === 0 && !props.distance
            ? "Checked"
            : null
        }
        onClick={props.setCallback}
      />
      <label htmlFor="allresults">{props.labelText}</label>
      <br />
    </div>
  ) : props.type === "radioAndText" ? (
    <div className={appStyles.singleRadioButtonContainer}>
      <input
        type="radio"
        name={props.name}
        disabled
        hidden
        checked={props.customDistance}
      />
      <input
        disabled={!props.isLoaded ? true : false}
        id={props.id}
        name={props.name}
        //@ts-ignore
        onChange={props.setCallback}
        type="text"
        placeholder={props.placeholder}
        // @ts-ignore
        value={props.customDistance ? null : ""}
      />
    </div>
  ) : null;
};

export default SingleRadio;
