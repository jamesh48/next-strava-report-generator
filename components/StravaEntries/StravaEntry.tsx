import React from 'react';
import GeneralEntry from './GeneralEntry';
import DetailedEntry from './DetailedEntry';
import axios, { AxiosResponse } from 'axios';
import { StravaEntryProps } from './EntryTypes';

const StravaEntry: React.FC<StravaEntryProps> = ({
  showIndividualEntry,
  sport,
  entry,
  format,
  no,
  currentActivity,
  updateIndividualEntry,
}) => {
  const [editing, toggleEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState('');
  const [editedDescription, setEditedDescription] = React.useState('');

  React.useEffect(() => {
    if (currentActivity.id === Number(entry.activityId)) {
      setEditedName(currentActivity.name);
      setEditedDescription(currentActivity.description);
    }
  }, [currentActivity]);

  const handleActivityUpdate = async () => {
    toggleEditing(false);
    const { data: _updatedActivity }: AxiosResponse = await axios({
      url: '/api/putActivityUpdate',
      params: {
        activityId: currentActivity.id,
        name: editedName,
        description: editedDescription,
      },
    });

    // Update the entry
    updateIndividualEntry(currentActivity.id, editedName);
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
      setEditedDescription(currentActivity.description);
    }
    toggleEditing((x) => !x);
  };

  return (
    <div>
      <GeneralEntry
        sport={sport}
        no={no}
        entry={entry}
        format={format}
        editing={editing}
        editedName={editedName}
        currentActivity={currentActivity}
        handleNameChange={handleNameChange}
        showIndividualEntry={showIndividualEntry}
      />
      {currentActivity.id === Number(entry.activityId) && (
        <DetailedEntry
          editing={editing}
          currentActivity={currentActivity}
          editedDescription={editedDescription}
          handleEditingChange={handleEditingChange}
          handleDescriptionChange={handleDescriptionChange}
          handleActivityUpdate={handleActivityUpdate}
        />
      )}
    </div>
  );
};

export default StravaEntry;
