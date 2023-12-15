import session from "../middleware/withSession";
import database from "../middleware/withDatabase";
import accessToken from "../middleware/withAccessToken";
import nextConnect from "next-connect";
import { getAllUserActivities } from "../../backend/src/database/controllers";
import { Response } from "express";
const handler = nextConnect();

handler.use(session());
handler.use(accessToken());
handler.use(database());

handler.get(async ({ currentAccessToken }: any, res: Response) => {
  res.send(
    (await getAllUserActivities(currentAccessToken)).sort(
      (a: any, b: any) => b.distance / b.moving_time - a.distance / a.moving_time
    )
  );
});
export default handler;
