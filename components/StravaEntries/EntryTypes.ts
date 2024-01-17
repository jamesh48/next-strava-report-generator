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
  bestEfforts: string;
  description: string;
  deviceName: string;
  gearName: string;
  laps: string;
  mapPolyline: string;
  primaryPhotoUrl: string;
  segmentEfforts: string;
};

type Achievement = {
  rank: number;
  type: 'pr';
  type_id: number;
};

export interface BestEffort {
  name: string;
  achievements: Achievement[];
  pr_rank: null | number;
  distance: number;
  elapsed_time: number;
  moving_time: number;
  start_index: number;
  end_index: number;
  start_date: Date;
  start_date_local: Date;
}

export interface SegmentEffort extends BestEffort {
  average_heartrate: number;
  max_heartrate: number;
  segment: {
    activity_type: Sport;
    average_grade: number;
    city: string;
    state: string;
    country: string;
    elevation_high: number;
    elevation_low: number;
    end_latlng: [number, number];
    start_latlng: [number, number];
    private: boolean;
  };
}

export type CurrentActivity = {
  id: number;
  name: string;
  kudos_count: number;
  comment_count: number;
  average_heartrate: number;
  max_heartrate: number;
  achievement_count: number;
  best_efforts: BestEffort[];
  segment_efforts: SegmentEffort[];
  description: string;
  device_name?: string;
  gear?: {
    name: string;
  };
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
