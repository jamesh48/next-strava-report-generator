import { AccessTokenAttributes } from "./models/access_token_model";
import sequelize from "./config";
import { upsertAccess, upsertRefresh } from "./utils";
import { RefreshTokenAttributes, RefreshTokenModel } from "./models/refresh_token_model";
import { ActivityStatic } from "./models/activity_model";

export const getAllUserActivities: (
  accessToken: string
) => Promise<ActivityStatic[]> = async (accessToken) => {
  const { AccessToken, Activity } = sequelize.models;
  try {
    const currentAccessToken = await AccessToken.findOne({
      where: { accessToken: accessToken }
    });

    const userActivities = await Activity.findAll({
      where: { athleteId: currentAccessToken?.athleteId }
    });

    return userActivities;
  } catch (err: any) {
    console.log(err.message);
    return err.message;
  }
};

export const addAllActivities = async (totalEntries: any[]) => {
  const { Activity } = sequelize.models;

  totalEntries = totalEntries.map((entry) => {
    return { ...entry, athleteId: entry.athlete.id, activityId: entry.id };
  });
  try {
    const newActivities = await Activity.bulkCreate(totalEntries, {
      fields: [
        "id",
        "athleteId",
        "activityId",
        "name",
        "type",
        "start_date",
        "distance",
        "moving_time",
        "elapsed_time",
        "average_speed",
        "max_speed",
        "elev_high",
        "elev_low",
        "total_elevation_gain",
        "average_heartrate",
        "max_heartrate",
        "location_city",
        "location_state",
        "location_country",
        "achievement_count",
        "kudos_count",
        "comment_count",
        "pr_count"
      ],
      ignoreDuplicates: false,
      updateOnDuplicate: [
        "name",
        "type",
        "start_date",
        "activityId",
        "distance",
        "moving_time",
        "elapsed_time",
        "average_speed",
        "max_speed",
        "elev_high",
        "elev_low",
        "total_elevation_gain",
        "average_heartrate",
        "max_heartrate",
        "location_city",
        "location_state",
        "location_country",
        "achievement_count",
        "kudos_count",
        "comment_count",
        "pr_count"
      ]
    });
    return newActivities;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
};

export const updateOneActivity = async (activityId: string, newName: string) => {
  const { Activity } = sequelize.models;
  try {
    await Activity.update(
      {
        name: newName
      },
      { where: { activityId: activityId } }
    );

    return "ok";
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const upsertAccessToken = async (newAccessTokenObj: AccessTokenAttributes) => {
  const { AccessToken } = sequelize.models;
  try {
    await upsertAccess(AccessToken, newAccessTokenObj, {
      athleteId: newAccessTokenObj.athleteId
    });
    return "ok";
  } catch (err: any) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

export const upsertRefreshToken = async (newRefreshTokenObj: RefreshTokenAttributes) => {
  const { RefreshToken } = sequelize.models;
  try {
    await upsertRefresh(RefreshToken, newRefreshTokenObj, {
      athleteId: newRefreshTokenObj.athleteId
    });
    return "ok";
  } catch (err: any) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

export const findAccessTokenFromCookie = async (cookiedAthleteId: number) => {
  const { AccessToken } = sequelize.models;
  try {
    const accessToken = await AccessToken.findOne({
      where: { athleteId: cookiedAthleteId }
    });
    return accessToken;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const findRefreshTokenFromCookie: (
  cookiedAthleteId: number
) => Promise<RefreshTokenModel | null> = async (cookiedAthleteId) => {
  const { RefreshToken } = sequelize.models;
  try {
    const refreshToken = await RefreshToken.findOne({
      where: { athleteId: cookiedAthleteId }
    });
    return refreshToken;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const deleteEntries = async (cookiedAthleteId: string) => {
  const { Activity } = sequelize.models;
  try {
    // Delete All Entries for the given user
    await Activity.destroy({
      where: {
        athleteId: cookiedAthleteId
      }
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const deleteTokens = async (cookiedAthleteId: number) => {
  const { AccessToken, RefreshToken } = sequelize.models;
  try {
    await AccessToken.destroy({
      where: {
        athleteId: cookiedAthleteId
      }
    });

    await RefreshToken.destroy({
      where: {
        athleteId: cookiedAthleteId
      }
    });
    return "ok";
  } catch (err: any) {
    throw new Error(err.message);
  }
};
