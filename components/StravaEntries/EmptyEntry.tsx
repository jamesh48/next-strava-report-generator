import React from "react";
import reportStyles from "../../styles/report.module.scss";

const EmptyEntry: React.FC<{}> = () => {
  return (
    <li>
      <div className={reportStyles.innerEntry}>
        <div className={reportStyles.generalEntry}>
          <h4 className={reportStyles.entryTitle} id={reportStyles.noEntriesFound}>
            ~No Entries Found~
          </h4>
          <p id={reportStyles.champ}>But keep up the Good Work Champ!</p>
        </div>
      </div>
    </li>
  );
};

export default EmptyEntry;
