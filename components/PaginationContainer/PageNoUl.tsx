import React from 'react';
import { List } from '@mui/material';
//
import { Entry } from '@components/StravaEntries/EntryTypes';
import PageNo from './PageNoLi';

interface PageNoUlProps {
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  currentPage: number;
  entriesPerPage: number;
  entries: Entry[];
}
const PageNoUl = (props: PageNoUlProps) => {
  const renderPageNumbers = () => {
    return [
      ...new Array(Math.ceil(props.entries.length / props.entriesPerPage)),
    ]
      .map((_x, index) => {
        return index + 1;
      })
      .map((number) => {
        return (
          <PageNo
            key={number}
            number={number}
            page={props.currentPage}
            handleClick={props.handleClick}
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
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          width: '0', // Hide the scrollbar
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'transparent', // Transparent color for the thumb
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent', // Transparent color for the track
        },
      }}
    >
      {props.entries?.length ? renderPageNumbers() : null}
    </List>
  );
};

export default PageNoUl;
