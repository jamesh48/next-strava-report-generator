import React from 'react';
import { Typography } from '@mui/material';

interface NestedEntryDescriptorProps {
  title: string;
  value: string;
  extra: string;
}

const NestedEntryDescriptor = (props: NestedEntryDescriptorProps) => {
  return (
    <Typography className="entryDescriptor" style={{ cursor: 'default' }}>
      {props.title}{' '}
      <Typography className="speed" sx={{ display: 'inline', padding: 'none' }}>
        {props.value}
      </Typography>{' '}
      {props.extra}
    </Typography>
  );
};

export default NestedEntryDescriptor;
