import type { Sport } from '@components/StravaEntries/EntryTypes'
import { Box, Button, useTheme } from '@mui/material'
import { useGetMonthlyStatsQuery } from '@redux/slices'
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
import { useState } from 'react'
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

export interface ActivityChartProps {
  activityType: Sport
}

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

const ActivityChart = (props: ActivityChartProps) => {
  const theme = useTheme()
  const [currentlyShownChart, setCurrentlyShownChart] = useState<
    'count' | 'distance'
  >('count')

  const dataMap = {
    count: {
      title: 'Number of Activities',
      color: theme.palette.strava.contrastColor,
    },
    distance: {
      title: 'Distance of Activities',
      color: theme.palette.strava.contrastColor,
    },
  }

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

  const { data: monthlyStats } = useGetMonthlyStatsQuery({
    activityType: props.activityType,
  })

  const currentYear = new Date().getFullYear()

  const thisYearsActivities =
    monthlyStats?.filter((entry) =>
      entry.month.startsWith(currentYear.toString()),
    ) || []

  const activityMap = new Map(
    thisYearsActivities.map(({ month, ...value }) => [month, value]),
  )

  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const yearMonth = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`
    return {
      label: monthNames[i],
      data: activityMap.get(yearMonth) || { count: 0, distance: 0 },
    }
  })

  const data = {
    labels: allMonths.map((month) => month.label),
    datasets: [
      {
        label: dataMap[currentlyShownChart].title,
        data: allMonths.map((month) => month.data[currentlyShownChart]),
        borderColor: dataMap[currentlyShownChart].color,
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
