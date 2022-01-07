import React from "react";
import { RadioColumnProps } from "./RadioTypes";
import SingleRadio from "./SingleRadio";
import appStyles from "../../../styles/App.module.scss";
const RadioColumn: React.FC<RadioColumnProps> = (props) => {
  return (
    <div className={appStyles.chooseRadioContainer}>
      <h4 className={appStyles.chooseTitle} id={props.title.split(" ").join("-").toLowerCase()}>
        {props.title}
      </h4>
      <div className={appStyles.multipleRadioButtonContainer}>
        {props.radioValues.map((radio, index) => {
          return <SingleRadio key={index} {...radio} {...props} index={index} />;
        })}
      </div>
    </div>
  );
};

export default RadioColumn;
