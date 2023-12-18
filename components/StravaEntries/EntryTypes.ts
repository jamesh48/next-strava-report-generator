import React from 'react';

export interface StravaEntryProps {
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  sport: string;
  entry: Entry;
  format: string | undefined;
  no: number | undefined;
  currentActivity: CurrentActivity;
  updateIndividualEntry: (
    entryId: number,
    updatedName: string
  ) => Promise<void>;
}

export interface EntryDescriptorProps {
  title: string;
  value: string;
}

export type Entry = {
  activityId: number;
  name: string;
  start_date: string;
  max_speed: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
};

export interface GeneralEntryProps {
  no: number | undefined;
  editing: boolean;
  editedName: string;
  entry: Entry;
  sport: string;
  format: string | undefined;
  currentActivity: CurrentActivity;
  handleNameChange: (e: { target: { value: string } }) => void;
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
}

export interface NestedEntryDescriptorProps {
  title: string;
  value: string;
  extra: string;
}

export type CurrentActivity = {
  id: number;
  name: string;
  kudos_count: number;
  comment_count: number;
  average_heartrate: number;
  max_heartrate: number;
  achievement_count: number;
  description: string;
  device_name: string;
  laps: {
    max_heartrate: number;
    average_heartrate: number;
    distance: number;
  }[];
  photos: {
    primary: {
      urls: {
        '600': string;
      };
    };
  };
};

export interface EntryUIProps {
  entries: Entry[];
  entriesPerPage: number;
  currentPage: number;
  currentActivity: CurrentActivity;
  invalidEntry: boolean;
  sport: string;
  format?: string | undefined;
  showIndividualEntry: React.MouseEventHandler<HTMLAnchorElement>;
  updateIndividualEntry: (
    entryId: number,
    updatedName: string
  ) => Promise<void>;
}
