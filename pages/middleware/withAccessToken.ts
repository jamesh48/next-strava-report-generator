import { AxiosRequestConfig } from "axios";
import { getCurrCredentials, refreshAccessToken } from "../../backend/src/server/serverUtils";

const getRefreshedAccessTokenConfig: (refreshToken: string) => AxiosRequestConfig = (
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

const withAccessToken = () => {
  return async (req: any, res: any, next: any) => {
    if (!req.session?.athleteId) {
      return res.status(400).send("No Cookied User!!!");
    }
    try {
      const { accessToken, expiresAt } = await getCurrCredentials(req.session.athleteId);

      const now = new Date();
      const later = new Date(expiresAt);

      if (now > later) {
        console.log("Refreshing Access Token...");
        const newAccessToken = await refreshAccessToken(
          getRefreshedAccessTokenConfig,
          req.session.athleteId,
        );
        req.currentAccessToken = newAccessToken;
      } else {
        req.currentAccessToken = accessToken;
      }
    } catch (err: any) {
      console.log(err.statusCode);
      return res.status(500).send(err.message);
    }
    next();
  };
};

export default withAccessToken;
