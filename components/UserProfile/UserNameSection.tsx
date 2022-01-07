import React from "react";
import style from "../../styles/App.module.scss";
interface UserNameSection {
  profile: {
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;
  };
}

const UserNameSection: React.FC<UserNameSection> = ({ profile }) => {
  return (
    <div className={style.profileBoxes} id={style.userInfo}>
      <h3 id={style.userName}>
        {profile.firstname} {profile.lastname}
      </h3>
      <h5 id={style.userLocation}>
        {profile.city}, {profile.state} {profile.country}
      </h5>
    </div>
  );
};

export default UserNameSection;
