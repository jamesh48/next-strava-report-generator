import axios from 'axios';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId;
    const { hasAchievements, limit, search, activityType, lastKey, beforeDate, afterDate } = req.query;

    const { data } = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/allActivities`,
      method: 'GET',
      params: {
        srg_athlete_id,
        activity_type: activityType,
        limit: limit ? parseInt(limit as string, 10) : 50,
        lastKey: lastKey ? lastKey : undefined,
        ...(beforeDate ? { before_date: beforeDate } : {}),
        ...(afterDate ? { after_date: afterDate } : {}),
        ...(search ? { search: search } : {}),
        has_achievements: hasAchievements,
        // TODO: PAss from Frontend
        sort_condition: 'speedDesc'
      },
    });

    return res.send({
      ...data,
      items: data.items.sort(
        (a: any, b: any) =>
          b.distance / b.moving_time - a.distance / a.moving_time
      ),
    });
  } catch (err) {
    res.send([]);
  }
});
export default handler;
