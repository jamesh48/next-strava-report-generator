import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId
    const {
      hasAchievements,
      limit,
      search,
      activityType,
      lastKey,
      minDistance,
      maxDistance,
      beforeDate,
      afterDate,
      sortCondition,
    } = req.query

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
        sort_condition: sortCondition,
        ...(minDistance ? { min_distance: minDistance } : {}),
        ...(maxDistance ? { min_distance: maxDistance } : {}),
      },
    })
    return res.send(data)
  } catch (_err) {
    res.send([])
  }
})
export default handler
