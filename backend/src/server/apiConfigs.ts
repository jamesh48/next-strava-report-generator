require("dotenv").config({ path: "configs/dotenv/.env" });
import { AxiosRequestConfig } from "axios";

export const getAthleteAuthConfig = (currentAccessToken: string, _currentScopes?: string) => {
  return {
    url: "https://www.strava.com/api/v3/athlete",
    headers: {
      Authorization: currentAccessToken,
    },
    scope: "activity:read_all",
  };
};

export const getAllEntriesConfig: (currentAccessToken: string) => AxiosRequestConfig = (
  currentAccessToken,
) => {
  return {
    url: "https://www.strava.com/api/v3/athlete/activities",
    headers: {
      Authorization: currentAccessToken,
    },
    params: {
      page: 1,
      per_page: 200,
    },
    data: "",
  };
};

export const getStatsConfig: (
  currentAccessToken: string,
  athleteId: number,
) => AxiosRequestConfig = (currentAccessToken, athleteId) => {
  return {
    url: `https://www.strava.com/api/v3/athletes/${athleteId}/stats/`,
    headers: {
      Authorization: currentAccessToken,
    },
    data: "",
  };
};

export const getIndEntryConfig: (
  currentAccessToken: string,
  entryId: string,
) => AxiosRequestConfig = (currentAccessToken, entryId) => {
  return {
    url: `https://www.strava.com/api/v3/activities/${entryId}include_all_efforts=true`,
    headers: {
      Authorization: currentAccessToken,
    },
  };
};

export const getRefreshedAccessTokenConfig: (refreshToken: string) => AxiosRequestConfig = (
  refreshToken,
) => {
  return {
    method: "POST",
    url: "https://www.strava.com/api/v3/oauth/token",
    data: {
      client_id: process.env.USER_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  };
};
