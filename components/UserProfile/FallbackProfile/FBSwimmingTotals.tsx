import React from 'react';
import { Box } from '@mui/material';

const FBSwimmingTotals = () => (
  <Box className={`ytd-totals profile-boxes`}>
    <h4 className="ytd-totals-title">Year-To-Date Swim Totals</h4>
    <p className="ytd-descriptor">Number of Swims: Loading...</p>
    <p className="ytd-descriptor">Total Distance: Loading...</p>
    <p className="ytd-descriptor">Average Speed: Loading...</p>
  </Box>
);

export default FBSwimmingTotals;
