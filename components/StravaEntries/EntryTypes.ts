export interface EntryDescriptorProps {
  title: string;
  value: string;
}

export type Sport = 'Swim' | 'Run' | 'Ride' | 'Walk';

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
  max_speed: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  type: string;
  // Shared Details
  average_heartrate: number;
  max_heartrate: number;
  kudos_count: number;
  comment_count: number;
  achievement_count: number;
  // Cached Detailed Entry
  individualActivityCached?: true;
};

export type CachedEntry = {
  description: string;
  deviceName: string;
  laps: string;
  mapPolyline: string;
  primaryPhotoUrl: string;
};

export type CurrentActivity = {
  id: number;
  name: string;
  kudos_count: number;
  comment_count: number;
  average_heartrate: number;
  max_heartrate: number;
  achievement_count: number;
  description: string;
  device_name?: string;
  laps:
    | {
        max_heartrate: number;
        average_heartrate: number;
        distance: number;
      }[];
  map: {
    polyline?: string;
  };
  photos: {
    count: number;
    primary?: {
      urls: {
        '600': string;
      };
    };
  };
};
