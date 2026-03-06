import type { Sport } from '@components/StravaEntries/EntryTypes'
import type { SortCondition } from '@redux/slices'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId

    const graphqlQuery = {
      query: `
      query {
        userSettings(athleteId: "${srg_athlete_id}") {
        darkMode
        defaultSport
        defaultFormat
        defaultDate
    }
  }
    `,
      variables: {},
    }
    const { data } = await axios.post<{
      data: {
        userSettings: {
          darkMode: boolean
          defaultSport: Sport
          defaultFormat: SortCondition
          defaultDate: string
        }
      }
    }>(process.env.GRAPHQL_URL || '', graphqlQuery, {
      headers: { 'Content-Type': 'application/json' },
    })
    return res.send(data.data.userSettings)
  } catch (_err) {
    return res.send({
      darkMode: false,
      defaultSport: 'Run',
      defaultFormat: 'speedDesc',
      defaultDate: 'allTime',
    })
  }
})

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const srg_athlete_id = req.cookies.athleteId
    await axios({
      url: `${process.env.DATA_BASE_URL}/srg/saveUserSettings`,
      method: 'POST',
      params: { srg_athlete_id },
      data: {
        darkMode: req.body.selectedDarkMode,
        defaultSport: req.body.selectedSport,
        defaultFormat: req.body.selectedFormat,
        defaultDate: req.body.selectedDate,
      },
    })
    return res.send({ message: 'success' })
  } catch (err) {
    const typedErr = err as { message: string }

    return res.send(typedErr.message)
  }
})

export default handler
