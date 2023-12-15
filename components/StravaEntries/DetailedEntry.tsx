import React from "react";
import Image from "next/image";
// import "StaticImages/heartrate.png";
// import "StaticImages/kudos.jpeg";
// import "StaticImages/trophy.jpeg";
import { DetailedEntryProps } from "./EntryTypes";
import appStyles from "../../styles/App.module.scss";
import reportStyles from "../../styles/report.module.scss";

const DetailedEntry: React.FC<DetailedEntryProps> = ({
  currentActivity,
  editing,
  editedDescription,
  handleEditingChange,
  handleDescriptionChange,
  handleActivityUpdate
}) => {
  return (
    <div className={reportStyles.detailedEntry}>
      {/* Description */}
      <div className={reportStyles.topActivityDescription}>
        <h4>Activity Description:</h4>
        {editing ? (
          <textarea
            className={reportStyles.editingActivityTextArea}
            value={editedDescription}
            onChange={handleDescriptionChange}
          ></textarea>
        ) : (
          <p className={reportStyles.topActivityDescription}>
            {currentActivity.description}
          </p>
        )}
      </div>
      {/* Kudos & Comments */}
      <div id={appStyles.funStats}>
        <div id={appStyles.kudosX}>
          <Image
            height={150}
            width={150}
            alt="kudos-img"
            layout="intrinsic"
            src="/images/kudos.jpeg"
          />
          <div className={appStyles.kudosDescriptors}>
            <h5 id={reportStyles.kudosCount} className={appStyles.kudos}>
              Kudos- <p>{currentActivity.kudos_count}</p>
            </h5>
            <h5 id={appStyles.commentCount} className={appStyles.kudos}>
              Comments- <p>{currentActivity.comment_count}</p>
            </h5>
          </div>
        </div>

        {/* Heart Rate */}
        {currentActivity.average_heartrate ? (
          <div id={appStyles.goldenHeartRate}>
            <Image
              alt="heart-rate"
              height={150}
              width={150}
              layout="intrinsic"
              src="/images/heartrate.png"
            />
            <div className={appStyles.heartRateDescriptors}>
              <h5 id={appStyles.avgHeartRate} className={appStyles.heartRate}>
                Avg- <p>{`${currentActivity.average_heartrate} bpm`}</p>
              </h5>
              <h5 id={appStyles.maxHeartRate} className={appStyles.heartRate}>
                Max- <p>{`${currentActivity.max_heartrate} bpm`}</p>
              </h5>
            </div>
          </div>
        ) : (
          <div id={appStyles.goldenHeartRate}>
            <Image
              alt="heart-rate"
              height={150}
              width={150}
              src="/images/heartrate.png"
              layout="intrinsic"
            />
            <h5 className={appStyles.heartRate} id={appStyles.avgHeartRate}>
              <p>No HR Info Available</p>
            </h5>
            <h5 className={appStyles.heartRate} id={appStyles.maxHeartRate}>
              <p></p>
            </h5>
          </div>
        )}

        {/* Trophy Case */}
        <div id={appStyles.trophyCase}>
          <Image
            height={50}
            width={50}
            alt="trophy-img"
            src="/images/trophy.jpeg"
            layout="intrinsic"
          />
          <div className={appStyles.achievementCountDescriptor}>
            <h5 className={appStyles.achievements} id={appStyles.achievementCount}>
              Achievement Count-
              <p>{currentActivity.achievement_count}</p>
            </h5>
          </div>
          <h5 className={appStyles.achievements} id={appStyles.emptyCount}>
            <p></p>
          </h5>
        </div>

        {/* Empty Div For Spacing */}
        <div></div>

        {currentActivity.photos.primary ? (
          <Image
            src={currentActivity.photos.primary.urls["600"]}
            height={150}
            width={150}
            layout="fixed"
            alt="highlight-photo"
          />
        ) : null}
      </div>
      {/* Gear */}
      <div id={appStyles.topActivityGear}>
        <p>Gear: {currentActivity.device_name}</p>
      </div>
      {
        <div className={reportStyles.editingContainer}>
          {editing && (
            <a className={appStyles.editingLink} onClick={handleActivityUpdate}>
              Submit!
            </a>
          )}
          <a className={reportStyles.editingLink} onClick={handleEditingChange}>
            {editing ? "Cancel" : "Edit"}
          </a>
        </div>
      }
    </div>
  );
};

export default DetailedEntry;
