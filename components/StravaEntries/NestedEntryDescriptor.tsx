import React from 'react';
import { Box, Typography } from '@mui/material';

interface NestedEntryDescriptorProps {
  title: string;
  value: string;
  extra: string;
}

const NestedEntryDescriptor = (props: NestedEntryDescriptorProps) => {
  return (
    <Box
      className="entryDescriptor"
      style={{ cursor: 'default', paddingLeft: '6%' }}
    >
      <Typography sx={{ display: 'inline' }}>{props.title} </Typography>
      <Typography className="speed" sx={{ display: 'inline' }}>
        {props.value}
      </Typography>{' '}
      <Typography sx={{ display: 'inline' }}>{props.extra}</Typography>
    </Box>
  );
};

export default NestedEntryDescriptor;
