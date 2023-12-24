import React from 'react';
import UserNameSection from './FBUserNameSection';
import RunningTotals from './FBRunningTotals';
import SwimmingTotals from './FBSwimmingTotals';

const FBUserProfile = () => (
  <div id="user-profile">
    <img id="user-img" />
    <UserNameSection />
    <RunningTotals />
    <SwimmingTotals />
  </div>
);

export default FBUserProfile;
