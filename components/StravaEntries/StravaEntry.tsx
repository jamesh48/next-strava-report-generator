import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import GeneralEntry from './GeneralEntry';
import DetailedEntry from './DetailedEntry';
import { CurrentActivity, Entry, Format, Sport } from './EntryTypes';
import { useUpdateIndividualEntryMutation } from '@redux/slices';

export interface StravaEntryProps {
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  sport: Sport;
  entry: Entry;
  format: Format;
  no: number | undefined;
  currentActivity: CurrentActivity;
  handleCloseCurrentActivity: () => void;
}

const StravaEntry = (props: StravaEntryProps) => {
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [handleActivityUpdateMutation] = useUpdateIndividualEntryMutation();

  useEffect(() => {
    if (props.currentActivity.id === Number(props.entry.activityId)) {
      setEditedName(props.currentActivity.name);
      setEditedDescription(props.currentActivity.description);
    }
  }, [props.currentActivity, props.entry.activityId]);

  const handleDescriptionChange: (e: { target: { value: string } }) => void = (
    e
  ) => {
    setEditedDescription(e.target.value);
  };

  const handleNameChange: (e: { target: { value: string } }) => void = (e) => {
    setEditedName(e.target.value);
  };

  const handleEditingHeadlineChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | true
  ) => {
    // If Clickaway Event Happens while editing, send api request.
    if (e === true) {
      setEditingHeadline(false);
      handleActivityUpdateMutation({
        activityId: props.currentActivity.id,
        name: editedName,
        description: editedDescription,
      });
    } else {
      e.preventDefault();
      if (props.currentActivity.id === Number(props.entry.activityId)) {
        setEditingHeadline(true);
      } else {
        props.showIndividualEntry(e);
      }
    }
  };

  const handleEditingDesciptionChange = () => {
    if (editingDescription) {
      setEditingDescription(false);
      handleActivityUpdateMutation({
        activityId: props.currentActivity.id,
        name: editedName,
        description: editedDescription,
      });
    } else {
      setEditingDescription(true);
    }
  };

  const isCurrentActivity =
    props.currentActivity.id === Number(props.entry.activityId);
  return (
    <Box sx={{ width: '100%' }}>
      <GeneralEntry
        sport={props.sport}
        no={props.no}
        entry={props.entry}
        format={props.format}
        editingHeadline={editingHeadline}
        editedName={editedName}
        handleEditingHeadlineChange={handleEditingHeadlineChange}
        handleNameChange={handleNameChange}
        isCurrentActivity={isCurrentActivity}
      />
      {isCurrentActivity && (
        <DetailedEntry
          editingDescription={editingDescription}
          currentActivity={props.currentActivity}
          editedDescription={editedDescription}
          handleEditingDescriptionChange={handleEditingDesciptionChange}
          handleDescriptionChange={handleDescriptionChange}
          format={props.format}
          handleCloseCurrentActivity={props.handleCloseCurrentActivity}
        />
      )}
    </Box>
  );
};

export default StravaEntry;
