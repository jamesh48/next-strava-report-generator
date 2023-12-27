import React from 'react';
import { Box } from '@mui/material';
import GeneralEntry from './GeneralEntry';
import DetailedEntry from './DetailedEntry';
import { CurrentActivity, Entry, Format } from './EntryTypes';
import { useUpdateIndividualEntryMutation } from '@redux/slices';

interface StravaEntryProps {
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  sport: string;
  entry: Entry;
  format: Format;
  no: number | undefined;
  currentActivity: CurrentActivity;
}

const StravaEntry = (props: StravaEntryProps) => {
  const [editing, toggleEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState('');
  const [editedDescription, setEditedDescription] = React.useState('');
  const [handleActivityUpdateMutation] = useUpdateIndividualEntryMutation();

  React.useEffect(() => {
    if (props.currentActivity.id === Number(props.entry.activityId)) {
      setEditedName(props.currentActivity.name);
      setEditedDescription(props.currentActivity.description);
    }
  }, [props.currentActivity]);

  const handleActivityUpdate = async () => {
    toggleEditing(false);
    handleActivityUpdateMutation({
      activityId: props.currentActivity.id,
      name: editedName,
      description: editedDescription,
    });
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
