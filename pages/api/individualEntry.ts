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
    const { data } = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/individualEntry/${req.query.entryid}`,
      method: "GET",
      params: {
        srg_athlete_id,
      },
    });
    res.status(200).send(data);
  } catch (err: any) {
    return res.send(err.message);
  }
});

export default handler;
