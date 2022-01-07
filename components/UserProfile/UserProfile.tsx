import React from "react";
import UserNameSection from "./UserNameSection";
import RunningTotals from "./RunningTotals";
import SwimmingTotals from "./SwimmingTotals";
import { ProfileData } from "./UserProfileTypes";
import Image from "next/image";
// import { fetchDataUser } from "../../lib/FetchUser";
import testProfile from "../../backend/testData/profileTestData";
import style from "../../styles/App.module.scss";

const Profile: React.FC<{}> = () => {
  // const resource = fetchDataUser();
  //@ts-ignore
  // const profile: ProfileData & number = resource.user.read();
  const profile: ProfileData & number = testProfile;
  return (
    (profile !== 429 && (
      <div id={style.userProfile}>
        <Image
          height="250"
          width="250"
          alt="profile-picture"
          src={profile.profile}
        ></Image>
        <UserNameSection profile={profile} />
        <RunningTotals profile={profile} />
        <SwimmingTotals profile={profile} />
      </div>
    )) || (
      <div id={style.userProfile}>
        <div id={style.rateLimitContainer}>
          <span className="rate-limit-message">Collective Rate Limit Exceeded</span>
          <span className="rate-limit-message">Come again tomorrow champ</span>
        </div>
      </div>
    )
  );
};
export default Profile;
