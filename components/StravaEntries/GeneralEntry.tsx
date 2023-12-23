import React from 'react';
import EntryDescriptor from './EntryDescriptor';
import NestedEntryDescriptor from './NestedEntryDescriptor';
import reportStyles from '../../styles/report.module.scss';
import appStyles from '../../styles/App.module.scss';
import { CurrentActivity, Entry, Format } from './EntryTypes';

interface GeneralEntryProps {
  no: number | undefined;
  editing: boolean;
  editedName: string;
  entry: Entry;
  sport: string;
  format: Format;
  currentActivity: CurrentActivity;
  handleNameChange: (e: { target: { value: string } }) => void;
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
}

const GeneralEntry = (props: GeneralEntryProps) => {
  const m2y = 1.094;
  const mps2kph = 3.6;

  const pastTense =
    props.sport === 'Walk'
      ? 'Walked-'
      : props.sport === 'Swim'
      ? 'Swam-'
      : props.sport === 'Ride'
      ? 'Rode-'
      : props.sport === 'Run'
      ? 'Ran'
      : 'traveled-';

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
      return '00:00';
    }
  };

  return (
    <div
      id={
        Number(props.no) === 0
          ? reportStyles.entry1
          : Number(props.no) === 1
          ? reportStyles.entry2
          : Number(props.no) === 2
          ? reportStyles.entry3
          : ''
      }
      className={reportStyles.innerEntry}
    >
      <div
        className={
          Number(props.no) >= 0 && Number(props.no) <= 2
            ? `${reportStyles.generalEntry} ${reportStyles.specialEntry}`
            : reportStyles.generalEntry
        }
      >
        {props.editing ? (
          <input
            type="text"
            value={props.editedName}
            onChange={props.handleNameChange}
          />
        ) : (
          <a
            className={reportStyles.entryTitle}
            data-indentry={props.entry.activityId}
            href=""
            onClick={props.showIndividualEntry}
          >
            {props.entry.name}
          </a>
        )}
        {props.format !== 'avgypace' ? (
          <EntryDescriptor
            title={`Distance ${pastTense}`}
            value={`${props.entry.distance} Meters`}
          />
        ) : (
          <EntryDescriptor
            title={`Distance ${pastTense}`}
            value={`${(props.entry.distance * 1.094).toFixed()} Yards`}
          />
        )}

        <EntryDescriptor
          title="Time Elapsed- "
          value={handleTime(props.entry.elapsed_time)}
        />

        <EntryDescriptor
          title="Moving Time- "
          value={handleTime(props.entry.moving_time)}
        />

        {/* For Debugging  */}
        {/* <p className="entry-descriptor">id = {entry.activityId}</p> */}

        {/* Format */}
        {props.format === 'kph' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(
              (props.entry.distance / props.entry.moving_time) *
              mps2kph
            ).toFixed(2)}
            extra="kph"
          />
        ) : props.format === 'mph' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(
              (props.entry.distance / props.entry.moving_time) *
              2.237
            ).toFixed(2)}
            extra="mph"
          />
        ) : props.format === 'mps' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(props.entry.distance / props.entry.moving_time).toFixed(2)}
            extra="mps"
          />
        ) : props.format === 'avgypace' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={handleTime(
              props.entry.moving_time / ((props.entry.distance * 1.094) / 100),
              'pace'
            )}
            extra="/100 Yards"
          />
        ) : props.format === 'avgmpace' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={handleTime(
              props.entry.moving_time / (props.entry.distance / 100),
              'pace'
            )}
            extra="/100 Meters"
          />
        ) : null}
        {/* Max Speed Format  */}

        {props.format === 'kph' ? (
          <NestedEntryDescriptor
            title="Max Speed-"
            value={(Number(props.entry.max_speed) * mps2kph).toFixed(2)}
            extra="kph"
          />
        ) : props.format === 'mph' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={(Number(props.entry.max_speed) * 2.237).toFixed(2)}
            extra="mph"
          />
        ) : props.format === 'mps' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={Number(props.entry.max_speed).toFixed(2)}
            extra="mps"
          />
        ) : props.format === 'avgypace' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={handleTime(
              100 / (Number(props.entry.max_speed) * m2y),
              'pace'
            )}
            extra="/100 yards"
          />
        ) : props.format === 'avgmpace' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={handleTime(100 / Number(props.entry.max_speed), 'pace')}
            extra="/100 Meters"
          />
        ) : null}

        <p className={appStyles.entryEDescriptor}>
          {new Date(props.entry.start_date).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default GeneralEntry;
