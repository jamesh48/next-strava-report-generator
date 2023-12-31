import React from 'react';
import { List, MenuItem, Select, SelectChangeEvent } from '@mui/material';
//
import { useMobileBrowserCheck } from '@lib';
import { Entry } from '@components/StravaEntries/EntryTypes';

interface PageNoUlProps {
  handleClick: ((event: SelectChangeEvent<string>) => void) &
    React.MouseEventHandler<HTMLLIElement>;
  currentPage: number;
  entriesPerPage: number;
  entries: Entry[];
}
const PageNoUl = (props: PageNoUlProps) => {
  const isMobile = useMobileBrowserCheck();

  if (isMobile) {
    return (
      <Select
        className="pageNoUls"
        id="pageNumbers"
        sx={{ marginBottom: '1%', display: 'flex', textAlign: 'center' }}
        value={props.currentPage.toString()}
        onChange={props.handleClick}
      >
        {(() => {
          if (props.entries?.length) {
            return [
              ...new Array(
                Math.ceil(props.entries.length / props.entriesPerPage)
              ),
            ]
              .map((_x, index) => {
                return index + 1;
              })
              .map((number) => {
                return (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                );
              });
          }
          return null;
        })()}
      </Select>
    );
  }
  // Desktop View
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
      {/* {props.entries?.length ? renderPageNumbers() : null} */}
      {(() => {
        if (props.entries?.length) {
          return [
            ...new Array(
              Math.ceil(props.entries.length / props.entriesPerPage)
            ),
          ]
            .map((_x, index) => {
              return index + 1;
            })
            .map((number) => {
              return (
                <MenuItem
                  key={number}
                  style={
                    Number(props.currentPage) === number
                      ? { backgroundColor: 'coral' }
                      : {}
                  }
                  value={number}
                  id={'pageno-' + number}
                  onClick={props.handleClick}
                  className="pageNos"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid coral',
                    padding: '5px 10px 5px 10px',
                    backgroundColor: 'paleturquoise',
                    marginTop: '5px',
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: 'coral',
                      borderX: '2px solid ivory',
                    },
                  }}
                >
                  {number}
                </MenuItem>
              );
            });
        }
        return null;
      })()}
    </List>
  );
};

export default PageNoUl;
