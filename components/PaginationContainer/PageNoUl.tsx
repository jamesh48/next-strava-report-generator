import React from 'react';
import { Entry } from '../StravaEntries/EntryTypes';
import PageNo from './PageNoLi';
import { List } from '@mui/material';

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
  handleClick,
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
    <List
      className="pageNoUls"
      id="pageNumbers"
      disablePadding={true}
      sx={{
        listStyleType: 'none',
        marginBottom: '1%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {renderPageNumbers()}
    </List>
  );
};

export default PageNoUl;
