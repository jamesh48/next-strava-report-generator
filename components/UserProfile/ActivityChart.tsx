import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useGetAllEntriesQuery } from '@redux/slices';
import { useState } from 'react';
import { Button, Box } from '@mui/material';

interface CalendarDates {
  jan: { count: number; distance: number };
  feb: { count: number; distance: number };
  mar: { count: number; distance: number };
  apr: { count: number; distance: number };
  may: { count: number; distance: number };
  june: { count: number; distance: number };
  july: { count: number; distance: number };
  aug: { count: number; distance: number };
  sept: { count: number; distance: number };
  oct: { count: number; distance: number };
  nov: { count: number; distance: number };
  dec: { count: number; distance: number };
}

interface ActivityChartProps {
  activityType: 'Run' | 'Swim' | 'Ride' | 'Walk';
}

const dataMap = {
  count: { title: 'Number of Activities', color: 'orangered' },
  distance: { title: 'Distance of Activities', color: 'darkslategray' },
};

const ActivityChart = (props: ActivityChartProps) => {
  const [currentlyShownChart, setCurrentlyShownChart] =
    useState<string>('count');

  const options = {
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
        text: props.activityType + ' Activities',
      },
    },
  };

  const { data: allEntries } = useGetAllEntriesQuery(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const activities = allEntries?.filter(
    (entry) => entry.type === props.activityType
  );
  const thisYearsActivities =
    activities?.filter((entry) =>
      entry.start_date.startsWith(currentYear.toString())
    ) || [];

  const thisYearsActivityData = thisYearsActivities.reduce<CalendarDates>(
    (total, item) => {
      if (item.start_date.startsWith(currentYear + '-01')) {
        total.jan.count = total.jan.count + 1;
        total.jan.distance = total.jan.distance + Number(item.distance);
      }

      if (item.start_date.startsWith(currentYear + '-02')) {
        total.feb.count = total.feb.count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-03')) {
        total.mar.count = total.mar.count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-04')) {
        total['apr'].count = total['apr'].count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-05')) {
        total.may.count = total.may.count + 1;
        total.may.distance = total.may.distance + Number(item.distance);
      }

      if (item.start_date.startsWith(currentYear + '-06')) {
        total['june'].count = total['june'].count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-07')) {
        total['july'].count = total['july'].count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-08')) {
        total['aug'].count = total['aug'].count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-09')) {
        total['sept'].count = total['sept'].count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-10')) {
        total.oct.count = total.oct.count + 1;
      }

      if (item.start_date.startsWith(currentYear + '-11')) {
        total.nov.count = total.nov.count + 1;
        total.nov.distance = total.nov.distance + Number(item.distance);
      }

      if (item.start_date.startsWith(currentYear + '-12')) {
        total.dec.count = total.dec.count + 1;
        total.dec.distance = total.dec.distance + Number(item.distance);
      }
      return total;
    },
    {
      jan: { count: 0, distance: 0 },
      feb: { count: 0, distance: 0 },
      mar: { count: 0, distance: 0 },
      apr: { count: 0, distance: 0 },
      may: { count: 0, distance: 0 },
      june: { count: 0, distance: 0 },
      july: { count: 0, distance: 0 },
      aug: { count: 0, distance: 0 },
      sept: { count: 0, distance: 0 },
      oct: { count: 0, distance: 0 },
      nov: { count: 0, distance: 0 },
      dec: { count: 0, distance: 0 },
    } as CalendarDates
  );

  const data = {
    labels: Object.entries(thisYearsActivityData).map(([month]) => month),
    datasets: [
      {
        label: dataMap[currentlyShownChart as 'count'].title,
        data: Object.entries(thisYearsActivityData).map(
          ([_month, hits]) => hits[currentlyShownChart]
        ),
        borderColor: dataMap[currentlyShownChart as 'count'].color,
        backgroundColor: 'coral',
        yAxisId: 'y',
      },
    ],
  };
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
  );
};

export default ActivityChart;
