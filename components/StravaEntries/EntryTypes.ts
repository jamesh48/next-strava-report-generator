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

export type APIEntry = {
  activityId: number;
  name: string;
  startDate: string;
  maxSpeed: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  type: string;
  // Shared Details
  averageHeartrate: number;
  max_heartrate: number;
  kudosCount: number;
  commentCount: number;
  achievementCount: number;
  // Cached Detailed Entry
  individualActivityCached?: true;
};

export type UIEntry = Omit<APIEntry, 'distance' | 'elapsed_time'> & {
  averagePace: string;
  distance: string;
  elapsed_time: string
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
  calories: number
  comment_count: number;
  average_heartrate: number;
  average_speed: number;
  distance: number
  max_heartrate: number;
  max_speed: number;
  achievement_count: number;
  best_efforts?: BestEffort[];
  segment_efforts: SegmentEffort[];
  description: string;
  device_name?: string;
  start_date: string;
  start_date_local: string;
  gear?: {
    id: string;
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
