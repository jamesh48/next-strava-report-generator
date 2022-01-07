import React from "react";
import { NestedEntryDescriptorProps } from "./EntryTypes";
import appStyles from "../../styles/App.module.scss";
const NestedEntryDescriptor: React.FC<NestedEntryDescriptorProps> = ({
  title,
  value,
  extra
}) => {
  return (
    <p className={appStyles.entryDescriptor}>
      {title} <p className={appStyles.speed}>{value}</p> {extra}
    </p>
  );
};

export default NestedEntryDescriptor;
