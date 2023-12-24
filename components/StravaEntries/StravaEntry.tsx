import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Box } from '@mui/material';
import GeneralEntry from './GeneralEntry';
import DetailedEntry from './DetailedEntry';
import { CurrentActivity, Entry, Format } from './EntryTypes';

interface StravaEntryProps {
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  sport: string;
  entry: Entry;
  format: Format;
  no: number | undefined;
  currentActivity: CurrentActivity;
  updateIndividualEntry: (
    entryId: number,
    updatedName: string
  ) => Promise<void>;
}

const StravaEntry = (props: StravaEntryProps) => {
  const [editing, toggleEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState('');
  const [editedDescription, setEditedDescription] = React.useState('');

  React.useEffect(() => {
    if (props.currentActivity.id === Number(props.entry.activityId)) {
      setEditedName(props.currentActivity.name);
      setEditedDescription(props.currentActivity.description);
    }
  }, [props.currentActivity]);

  const handleActivityUpdate = async () => {
    toggleEditing(false);
    const { data: _updatedActivity }: AxiosResponse = await axios({
      url: '/api/putActivityUpdate',
      params: {
        activityId: props.currentActivity.id,
        name: editedName,
        description: editedDescription,
      },
    });

    // Update the entry
    props.updateIndividualEntry(props.currentActivity.id, editedName);
  };

  const handleDescriptionChange: (e: { target: { value: string } }) => void = (
    e
  ) => {
    setEditedDescription(e.target.value);
  };

  const handleNameChange: (e: { target: { value: string } }) => void = (e) => {
    setEditedName(e.target.value);
  };

  const handleEditingChange: React.MouseEventHandler<HTMLAnchorElement> = (
    event
  ) => {
    if (event.currentTarget.innerHTML === 'Cancel') {
      setEditedDescription(props.currentActivity.description);
    }
    toggleEditing((x) => !x);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <GeneralEntry
        sport={props.sport}
        no={props.no}
        entry={props.entry}
        format={props.format}
        editing={editing}
        editedName={editedName}
        currentActivity={props.currentActivity}
        handleNameChange={handleNameChange}
        showIndividualEntry={props.showIndividualEntry}
      />
      {props.currentActivity.id === Number(props.entry.activityId) && (
        <DetailedEntry
          editing={editing}
          currentActivity={props.currentActivity}
          editedDescription={editedDescription}
          handleEditingChange={handleEditingChange}
          handleDescriptionChange={handleDescriptionChange}
          handleActivityUpdate={handleActivityUpdate}
          format={props.format}
        />
      )}
    </Box>
  );
};

export default StravaEntry;
