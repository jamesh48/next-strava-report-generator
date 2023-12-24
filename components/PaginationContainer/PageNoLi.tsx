import React from 'react';
import { ListItem } from '@mui/material';

interface PageNoLiProps {
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  number: number;
  page: number;
}

const PageNoLi = ({ handleClick, number, page }: PageNoLiProps) => {
  return (
    <ListItem
      key={number}
      style={Number(page) === number ? { backgroundColor: 'coral' } : {}}
      id={'pageno-' + number}
      onClick={handleClick}
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
    </ListItem>
  );
};

export default PageNoLi;
