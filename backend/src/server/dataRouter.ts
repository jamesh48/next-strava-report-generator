// const { performance } = require("perf_hooks");
import { AxiosRequestConfig } from "axios";
import * as express from "express";
import { Response } from "express";
const axios = require("axios");

import {
  addAllActivities,
  getAllUserActivities,
  updateOneActivity,
  deleteTokens,
  deleteEntries,
} from "../database/controllers";

import {
  getAthleteAuthConfig,
  getAllEntriesConfig,
  getStatsConfig,
  getIndEntryConfig,
  getRefreshedAccessTokenConfig,
} from "./apiConfigs";

import { getStravaResults, recurseResults, refreshAccessToken } from "./serverUtils";

import { getCurrCredentials } from "./serverUtils";
import { send400, send500, send429 } from "./sendErrorCodes";

const dataRouter = express.Router();

dataRouter.use(async (req: any, res: Response, next) => {
  if (!req.session?.athleteId) return send400(res, "No Cookied User!!!");
  try {
    const { accessToken, expiresAt } = await getCurrCredentials(req.session.athleteId);
    // Compare expiration date with now, and refresh the token if it has expired.
    const now = new Date();
    const later = new Date(expiresAt);
    if (now > later) {
      console.log("refreshing access token!");
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
    return send500(res, err.message);
  }
  next();
});

dataRouter.get("/loggedInUser", async ({ currentAccessToken }: any, res: Response) => {
  try {
    const athleteAuthConfig = getAthleteAuthConfig(currentAccessToken);
    var athlete = await axios(athleteAuthConfig);
  } catch (err: any) {
    if (err.request.res.statusCode === 429) {
      return send429(res, err.message);
    }
    return send500(res, err.message);
  }
  try {
    const statsConfig: AxiosRequestConfig = getStatsConfig(currentAccessToken, athlete.data.id);
    var stats = await axios(statsConfig);
  } catch (err: any) {
    return send500(res, err.message);
  }

  const fullAthlete = Object.assign(athlete.data, stats.data);
  res.status(200).send(fullAthlete);
});

dataRouter.get("/allEntries", async ({ currentAccessToken }: any, res: Response) => {
  res.send(
    (await getAllUserActivities(currentAccessToken)).sort(
      (a: any, b: any) => b.distance / b.moving_time - a.distance / a.moving_time,
    ),
  );
});

dataRouter.get(
  "/individualEntry",
  // @ts-ignore (not all code paths return a value)
  async ({ currentAccessToken, query: { entryid } }: any, res: Response) => {
    try {
      const indEntryConfig = getIndEntryConfig(currentAccessToken, entryid);
      let entry = await getStravaResults(indEntryConfig);
      res.status(200).send(entry);
    } catch (err: any) {
      return res.send(err.message);
    }
  },
);

dataRouter.post("/addAllActivities", async ({ currentAccessToken }: any, res: Response) => {
  const callback = async (finalEntriesArr: any[]) => {
    const totalEntries = finalEntriesArr
      .sort((a, b) => b.distance / b.moving_time - a.distance / a.moving_time)
      .filter(
        (x) => x.type === "Walk" || x.type === "Swim" || x.type === "Run" || x.type === "Ride",
      );
    console.log(`Done: ${totalEntries.length} Results Fetched`.red);
    console.log(`Uploading ${totalEntries.length} Entries to Database`);
    const allActivities = await addAllActivities(totalEntries);
    console.log(`Done- Uploaded ${allActivities.length} Entries to Database`);
    res.json(allActivities);
  };

  recurseResults(getAllEntriesConfig(currentAccessToken), [], callback);
});

dataRouter.put("/putActivityUpdate", async (req: any, res: Response) => {
  const putActivityUpdateConfig: AxiosRequestConfig = {
    method: "PUT",
    url: encodeURI(
      `https://www.strava.com/api/v3/activities/${req.query.activityId}?name=${req.query.name}&description=${req.query.description}`,
    ),
    headers: {
      Authorization: req.currentAccessToken,
    },
  };

  try {
    const { data: updatedActivity } = await axios(putActivityUpdateConfig);

    const { name, id } = updatedActivity;
    await updateOneActivity(id, name);

    res.send("updatedActivity");
  } catch (err: any) {
    console.log(err.message);
    res.send(err.message);
  }
});

dataRouter.delete("/destroy-user", async (req: any, res: Response) => {
  try {
    await deleteEntries(req.session.athleteId);
    await deleteTokens(req.session.athleteId);
    req.session.destroy();
    res.status(200).send("Deleted!");
  } catch (err: any) {
    res.status(500).send("Server Error!");
  }
});

export default dataRouter;
