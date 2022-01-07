import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface ActivityAttributes {
  id: number;
  activityId: number;
  athleteId: number;
  name: string;
  type: string;
  start_date: string;
  distance: number;
  elapsed_time: number;
  moving_time: number;
  average_speed: number;
  max_speed: number;
  elev_high: number;
  elev_low: number;
  total_elevation_gain: number;
  average_heartrate: number;
  max_heartrate: number;
  location_city: string;
  location_state: string;
  location_country: string;
  pr_count: number;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
}

export interface ActivityModel
  extends Model<ActivityAttributes>,
    ActivityAttributes {}

export class Activity extends Model<ActivityModel, ActivityAttributes> {}

export type ActivityStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ActivityModel;
};

export function ActivityFactory(sequelize: Sequelize): ActivityStatic {
  return <ActivityStatic>sequelize.define("activity", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true,
      // This is important for making sure that ignoreDuplicates works correctly
      unique: true
    },
    activityId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    athleteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    elapsed_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    moving_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    average_speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    max_speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    elev_high: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    elev_low: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    total_elevation_gain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    average_heartrate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    max_heartrate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    location_city: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    location_state: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    location_country: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    pr_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    achievement_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    kudos_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    comment_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    }
  });
}
