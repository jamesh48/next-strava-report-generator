import React from "react";
import { EntryDescriptorProps } from "./EntryTypes";
import appStyles from "../../styles/App.module.scss";

const EntryDescriptor: React.FC<EntryDescriptorProps> = ({ title, value }) => {
  return (
    <p className={appStyles.entryDescriptor}>
      {title} {value}
    </p>
  );
};

export default EntryDescriptor;
