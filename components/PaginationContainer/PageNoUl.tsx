import React from "react";
import { Entry } from "../StravaEntries/EntryTypes";
import PageNo from "./PageNoLi";
import reportStyles from "../../styles/report.module.scss";

interface PageNoUlProps {
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  currentPage: number;
  entriesPerPage: number;
  entries: Entry[];
}
const PageNoUl: React.FC<PageNoUlProps> = ({
  entries,
  entriesPerPage,
  currentPage,
  handleClick
}) => {
  const renderPageNumbers = () => {
    return [...new Array(Math.ceil(entries.length / entriesPerPage))]
      .map((_x, index) => {
        return index + 1;
      })
      .map((number) => {
        return (
          <PageNo
            key={number}
            number={number}
            page={currentPage}
            handleClick={handleClick}
          />
        );
      });
  };

  return (
    <ul className={reportStyles.pageNoUls} id={reportStyles.pageNumbers}>
      {renderPageNumbers()}
    </ul>
  );
};

export default PageNoUl;
