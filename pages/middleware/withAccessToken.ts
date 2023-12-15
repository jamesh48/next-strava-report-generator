import { getRefreshedAccessTokenConfig } from "../../backend/src/server/apiConfigs";
import {
  getCurrCredentials,
  refreshAccessToken
} from "../../backend/src/server/serverUtils";

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
          req.session.athleteId
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
