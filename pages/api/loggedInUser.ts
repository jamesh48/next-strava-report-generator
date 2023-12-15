import axios from "axios";
import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import session from "../middleware/withSession";
import database from "../middleware/withDatabase";
const handler = nextConnect();

handler.use(session());
handler.use(database());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const srg_athlete_id = req.cookies.athleteId;
  try {
    var athlete = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getLoggedInUser`,
      method: "GET",
      params: {
        srg_athlete_id,
      },
    });
    console.log(athlete);
  } catch (err: any) {
    if (err.request.res.statusCode === 429) {
      return res.status(429).send(err.message);
    }
    return res.status(500).send(err.message);
  }
  try {
    var stats = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getAthleteStats/${athlete.data.id}`,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }

  const fullAthlete = Object.assign(athlete.data, stats.data);
  return res.status(200).send(fullAthlete);
});

export default handler;
