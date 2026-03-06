import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect()

const ACTIVITIES_QUERY = `
  query Activities(
    $athlete_id: String!
    $activity_type: String
    $min_distance: Float
    $has_achievements: Boolean
    $search: String
    $after_date: Date
    $before_date: Date
    $sort_condition: String
    $limit: Int
    $offset: Int
  ) {
    activities(
      athleteId: $athlete_id
      activityType: $activity_type
      minDistance: $min_distance
      hasAchievements: $has_achievements
      search: $search
      afterDate: $after_date
      beforeDate: $before_date
      sortCondition: $sort_condition
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        activityId
        athleteId
        name
        type
        startDate
        distance
        movingTime
        elapsedTime
        averageSpeed
        maxSpeed
        totalElevationGain
        elevHigh
        elevLow
        averageHeartrate
        maxHeartrate
        locationCity
        locationState
        locationCountry
        achievementCount
        kudosCount
        commentCount
        prCount
        individualActivityCached
        description
        deviceName
        gearName
        mapPolyline
        primaryPhotoUrl
        bestEfforts
        laps
        segmentEfforts
      }
      total
      nextOffset
    }
  }
`

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const athlete_id = req.cookies.athleteId
    const {
      hasAchievements,
      search,
      activityType,
      minDistance,
      beforeDate,
      afterDate,
      sortCondition,
      limit,
      lastKey,
    } = req.query

    const { data } = await axios.post(process.env.GRAPHQL_URL as string, {
      query: ACTIVITIES_QUERY,
      variables: {
        athlete_id,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: lastKey ? parseInt(lastKey as string, 10) : 0,
        ...(activityType ? { activity_type: activityType } : {}),
        ...(minDistance
          ? { min_distance: parseFloat(minDistance as string) }
          : {}),
        ...(hasAchievements !== undefined
          ? { has_achievements: hasAchievements === 'true' }
          : {}),
        ...(search ? { search } : {}),
        ...(afterDate ? { after_date: afterDate } : {}),
        ...(beforeDate ? { before_date: beforeDate } : {}),
        ...(sortCondition ? { sort_condition: sortCondition } : {}),
      },
    })

    const { items, total, nextOffset } = data.data.activities
    return res.send({
      results: items,
      count: total,
      lastKey: nextOffset ?? null,
    })
  } catch (_err) {
    res.send([])
  }
})

export default handler
