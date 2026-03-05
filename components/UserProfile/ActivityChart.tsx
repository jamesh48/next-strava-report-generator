import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

import type { Sport } from '@components/StravaEntries/EntryTypes'
import { Box, Button, useTheme } from '@mui/material'
import { useGetMonthlyStatsQuery } from '@redux/slices'
import { useState } from 'react'

export interface ActivityChartProps {
  activityType: Sport
}

const ActivityChart = (props: ActivityChartProps) => {
  const theme = useTheme()
  const dataMap = {
    count: {
      title: 'Number of Activities',
      color: theme.palette.strava.contrastColor,
    },
    distance: {
      title: 'Distance of Activities',
      color: theme.palette.baseBackground.main,
    },
  }
  const [currentlyShownChart, setCurrentlyShownChart] =
    useState<string>('count')

  const options = {
    color: theme.palette.strava.main,
    responsive: true,
    stacked: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${props.activityType} Activities`,
        color: theme.palette.strava.main,
      },
    },
  }

  const { data: monthlyStats } = useGetMonthlyStatsQuery(
    {
      activityType: props.activityType,
    },
    {
      selectFromResult: ({ data, ...rest }) => {
        return { data: Object.entries(data || {}), ...rest }
      },
    },
  )

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  const thisYearsActivities =
    monthlyStats.filter((entry) =>
      entry[0].startsWith(currentYear.toString()),
    ) || []

  // Create a map of year-month to activity data for quick lookup
  const activityMap = new Map(
    thisYearsActivities.map(([key, value]) => [key, value]),
  )

  // Generate all 12 months for the current year
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const monthNum = (i + 1).toString().padStart(2, '0')
    const yearMonth = `${currentYear}-${monthNum}`
    return {
      key: yearMonth,
      label: monthNames[i],
      data: activityMap.get(yearMonth) || { count: 0, distance: 0 },
    }
  })

  const data = {
    labels: allMonths.map((month) => month.label),
    datasets: [
      {
        label: dataMap[currentlyShownChart as 'count'].title,
        data: allMonths.map(
          (month) => month.data[currentlyShownChart as 'count' | 'distance'],
        ),
        borderColor: dataMap[currentlyShownChart as 'count'].color,
        backgroundColor: theme.palette.strava.contrastColor,
        yAxisId: 'y',
      },
    ],
  }
  return (
    <Box>
      <Line options={options} data={data} />
      <Box>
        <Button onClick={() => setCurrentlyShownChart('count')}>Count</Button>
        <Button onClick={() => setCurrentlyShownChart('distance')}>
          Distance
        </Button>
      </Box>
    </Box>
  )
}

export default ActivityChart
