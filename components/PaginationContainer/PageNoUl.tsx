import React from 'react';
import {
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
//
import { useMobileBrowserCheck } from '@lib';
import { Entry } from '@components/StravaEntries/EntryTypes';

export interface PageNoUlProps {
  handleClick: ((event: SelectChangeEvent<string>) => void) &
    React.MouseEventHandler<HTMLLIElement>;
  currentPage: number;
  entriesPerPage: number;
  entries: Entry[];
}
const PageNoUl = (props: PageNoUlProps) => {
  const isMobile = useMobileBrowserCheck();
  const theme = useTheme();
  if (isMobile) {
    return props.entries?.length ? (
      <Select
        className="pageNoUls"
        id="pageNumbers"
        data-testid="pageNumbers"
        sx={{
          marginBottom: '1%',
          display: 'flex',
          textAlign: 'center',
          color: theme.palette.strava.contrastColor,
        }}
        inputProps={{
          sx: {
            bgcolor: theme.palette.mainBackground.dark,
            border: '2px solid ' + theme.palette.strava.main,
            fontSize: '1.25rem',
          },
        }}
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
                  <MenuItem
                    key={number}
                    value={number}
                    sx={{
                      textAlign: 'center !important',
                      display: 'flex',
                      justifyContent: 'center',
                      bgcolor:
                        props.currentPage === number
                          ? 'turquoise !important'
                          : theme.palette.mainBackground.light,
                      color:
                        props.currentPage === number
                          ? theme.palette.strava.contrastColor
                          : theme.palette.common.black,
                    }}
                  >
                    {number}
                  </MenuItem>
                );
              });
          }
          return null;
        })()}
      </Select>
    ) : null;
  }
  // Desktop View
  return (
    <List
      className="pageNoUls"
      id="pageNumbers"
      data-testid="pageNumbers"
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
                      ? { backgroundColor: theme.palette.strava.contrastColor }
                      : {}
                  }
                  value={number}
                  id={'pageno-' + number}
                  onClick={props.handleClick}
                  className="pageNos"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid ' + theme.palette.common.black,
                    padding: '.5rem .75rem',
                    backgroundColor: theme.palette.mainBackground.light,
                    marginTop: '.5rem',
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: theme.palette.strava.contrastColor,
                      border: '2px solid ' + theme.palette.strava.contrastText,
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
