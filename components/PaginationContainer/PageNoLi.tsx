import React from "react";
import { PageNoLiProps } from "./PaginationTypes";
import reportStyles from "../../styles/report.module.scss";
const PageNoLi: React.FC<PageNoLiProps> = ({ handleClick, number, page }) => {
  return (
    <li
      key={number}
      style={Number(page) === number ? { backgroundColor: "coral" } : {}}
      id={"pageno-" + number}
      onClick={handleClick}
      className={reportStyles.pageNos}
    >
      {number}
    </li>
  );
};

export default PageNoLi;
