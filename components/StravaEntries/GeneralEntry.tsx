import React from "react";
import EntryDescriptor from "./EntryDescriptor";
import { GeneralEntryProps } from "./EntryTypes";
import NestedEntryDescriptor from "./NestedEntryDescriptor";
import reportStyles from "../../styles/report.module.scss";
import appStyles from "../../styles/App.module.scss";
const GeneralEntry: React.FC<GeneralEntryProps> = ({
  no,
  entry,
  sport,
  format,
  editing,
  editedName,
  showIndividualEntry,
  handleNameChange
}) => {
  const m2y = 1.094;
  const mps2kph = 3.6;

  const pastTense =
    sport === "Walk"
      ? "Walked-"
      : sport === "Swim"
      ? "Swam-"
      : sport === "Ride"
      ? "Rode-"
      : sport === "Run"
      ? "Ran"
      : "traveled-";

  const handleTime: (movingTime: number, pace?: string) => string = (
    movingTime,
    pace
  ) => {
    if (movingTime !== Infinity) {
      if (pace) {
        return new Date(movingTime * 1000).toISOString().substr(15, 4);
      }
      return new Date(movingTime * 1000).toISOString().substr(11, 8);
    } else {
      return "00:00";
    }
  };

  return (
    <div
      id={
        Number(no) === 0
          ? reportStyles.entry1
          : Number(no) === 1
          ? reportStyles.entry2
          : Number(no) === 2
          ? reportStyles.entry3
          : ""
      }
      className={reportStyles.innerEntry}
    >
      <div
        className={
          Number(no) >= 0 && Number(no) <= 2
            ? `${reportStyles.generalEntry} ${reportStyles.specialEntry}`
            : reportStyles.generalEntry
        }
      >
        {editing ? (
          <input type="text" value={editedName} onChange={handleNameChange} />
        ) : (
          <a
            className={reportStyles.entryTitle}
            data-indentry={entry.activityId}
            href=""
            onClick={showIndividualEntry}
          >
            {entry.name}
          </a>
        )}
        {format !== "avgypace" ? (
          <EntryDescriptor
            title={`Distance ${pastTense}`}
            value={`${entry.distance} Meters`}
          />
        ) : (
          <EntryDescriptor
            title={`Distance ${pastTense}`}
            value={`${(entry.distance * 1.094).toFixed()} Yards`}
          />
        )}

        <EntryDescriptor title="Time Elapsed- " value={handleTime(entry.elapsed_time)} />

        <EntryDescriptor title="Moving Time- " value={handleTime(entry.moving_time)} />

        {/* For Debugging  */}
        {/* <p className="entry-descriptor">id = {entry.activityId}</p> */}

        {/* Format */}
        {format === "kph" ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={((entry.distance / entry.moving_time) * mps2kph).toFixed(2)}
            extra="kph"
          />
        ) : format === "mph" ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={((entry.distance / entry.moving_time) * 2.237).toFixed(2)}
            extra="mph"
          />
        ) : format === "mps" ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(entry.distance / entry.moving_time).toFixed(2)}
            extra="mps"
          />
        ) : format === "avgypace" ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={handleTime(
              entry.moving_time / ((entry.distance * 1.094) / 100),
              "pace"
            )}
            extra="/100 Yards"
          />
        ) : format === "avgmpace" ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={handleTime(entry.moving_time / (entry.distance / 100), "pace")}
            extra="/100 Meters"
          />
        ) : null}
        {/* Max Speed Format  */}

        {format === "kph" ? (
          <NestedEntryDescriptor
            title="Max Speed-"
            value={(entry.max_speed * mps2kph).toFixed(2)}
            extra="kph"
          />
        ) : format === "mph" ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={(entry.max_speed * 2.237).toFixed(2)}
            extra="mph"
          />
        ) : format === "mps" ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={entry.max_speed.toFixed(2)}
            extra="mps"
          />
        ) : format === "avgypace" ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={handleTime(100 / (entry.max_speed * m2y), "pace")}
            extra="/100 yards"
          />
        ) : format === "avgmpace" ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={handleTime(100 / entry.max_speed, "pace")}
            extra="/100 Meters"
          />
        ) : null}

        <p className={appStyles.entryEDescriptor}>
          {new Date(entry.start_date).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default GeneralEntry;
