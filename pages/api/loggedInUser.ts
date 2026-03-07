import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const srg_athlete_id = req.cookies.athleteId
  if (!srg_athlete_id) {
    return res.status(401).send({ error: 'Not authenticated' })
  }

  let athlete: { data: Record<string, unknown> }
  try {
    athlete = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getLoggedInUser`,
      method: 'GET',
      params: { srg_athlete_id },
    })
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 429) {
      return res.status(429).send({ error: err.message })
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).send({ error: message })
  }

  let stats: { data: unknown }
  try {
    stats = await axios({
      url: `${process.env.DATA_BASE_URL}/srg/getAthleteStats/${athlete.data.id}`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).send({ error: message })
  }

  return res.status(200).send({ ...athlete.data, ...(stats.data as object) })
})

export default handler
