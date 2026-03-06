import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const activityType = req.query.activityType
  const srg_athlete_id = req.cookies.athleteId

  try {
    const { data } = await axios.post(
      process.env.GRAPHQL_URL || '',
      {
        query: `
            query MonthlyStats($athleteId: String!, $activityType: String) {
              monthlyStats(athleteId: $athleteId, activityType: $activityType) {
                month
                count
                distance
              }
            }
          `,
        variables: {
          athleteId: srg_athlete_id,
          activityType,
        },
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    return res.send(data.data.monthlyStats)
  } catch (err) {
    const typedErr = err as {
      message: string
      request: { res: { statusCode: number } }
    }
    if (typedErr.request?.res?.statusCode === 429) {
      return res.status(429).send({ error: typedErr.message })
    }
    return res.status(500).send({ error: typedErr.message })
  }
})

export default handler
