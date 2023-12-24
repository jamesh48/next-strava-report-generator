import React from 'react';
import { Typography } from '@mui/material';
import { EntryDescriptorProps } from './EntryTypes';

const EntryDescriptor = (props: EntryDescriptorProps) => {
  return (
    <Typography className="entryDescriptor" sx={{ cursor: 'default' }}>
      {props.title} {props.value}
    </Typography>
  );
};

export default EntryDescriptor;
