import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import {
  findAccessTokenFromCookie,
  findRefreshTokenFromCookie,
  upsertAccessToken,
  upsertRefreshToken
} from "../database/controllers";

export const getStravaResults = async (config: AxiosRequestConfig) => {
  try {
    const { data: response }: AxiosResponse = await axios(config);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getCurrCredentials = async (athleteId: number) => {
  try {
    const currentAccessToken = await findAccessTokenFromCookie(athleteId);
    if (!currentAccessToken) {
      throw new Error("No Cookied User");
    }
    return currentAccessToken;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const refreshAccessToken = async (
  getRefreshedAccessTokenConfig: (refreshToken: string) => AxiosRequestConfig,
  athleteId: number
) => {
  // Get the refreshToken based on the cookied users athlete id
  const refreshToken = await findRefreshTokenFromCookie(athleteId);
  if (!refreshToken?.refreshToken) {
    throw new Error("no refresh token");
  }
  // With that refresh token, get a new access token
  const {
    data: { access_token, expires_at, refresh_token, token_type }
  }: AxiosResponse<{
    access_token: string;
    expires_at: number;
    refresh_token: string;
    token_type: string;
  }> = await axios(getRefreshedAccessTokenConfig(refreshToken.refreshToken));

  const authBearer = `${token_type} ${access_token}`;

  // And update both the access token and the refresh token in the database.
  await upsertAccessToken({
    athleteId: athleteId,
    expiresAt: expires_at * 1000,
    accessToken: authBearer
  });

  await upsertRefreshToken({
    athleteId: athleteId,
    refreshToken: refresh_token
  });

  return authBearer;
};

export const recurseResults = async (
  config: AxiosRequestConfig,
  resultArr: any[],
  callback: any
) => {
  const currentPageResults: any[] = await getStravaResults(config);
  console.log(
    `Current Page: ${config.params.page}, Results Length: ${currentPageResults.length}`
      .yellow
  );
  const nextArr = resultArr.concat(currentPageResults);

  if (currentPageResults.length < 200) {
    return callback(nextArr);
  } else {
    config.params.page = config.params.page + 1;
    recurseResults(config, nextArr, callback);
  }
};
