export interface EntryDescriptorProps {
  title: string;
  value: string;
}

export type Format =
  | 'avgmpace'
  | 'avgypace'
  | 'mps'
  | 'kph'
  | 'mph'
  | undefined;

export type Entry = {
  activityId: number;
  name: string;
  start_date: string;
  max_speed: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
};

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
