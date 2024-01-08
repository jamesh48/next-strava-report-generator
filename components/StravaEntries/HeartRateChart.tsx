import { Line } from 'react-chartjs-2';
import { Box, Button } from '@mui/material';
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
import { CurrentActivity, Format } from './EntryTypes';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HeartRateChartProps {
  currentActivity: CurrentActivity;
  format: Format;
}

const HeartRateChart = (props: HeartRateChartProps) => {
  const [hrData, setHrData] = useState(['avgHR']);
  const [data, setData] = useState({
    labels: ['0'],
    datasets: [
      {
        label: 'loading',
        data: [] as number[],
        backgroundColor: 'coral',
        borderColor: 'coral',
      },
    ],
  });
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Heart Rate',
      },
    },
  };

  const currentMeasurement = (() => {
    if (props.format === 'avgypace') {
      return 'yds';
    }
    return 'mtrs';
  })();

  useEffect(() => {
    if (props.currentActivity.laps) {
      let cumulativeDistance = 0;

      const maxHeartRateDataSet = {
        label: 'Max Heart Rate',
        data: props.currentActivity.laps.map((x) => x.max_heartrate),
        borderColor: 'red',
        backgroundColor: 'red',
      };

      const averageHeartRateDataSet = {
        label: 'Average Heart Rate',
        data: props.currentActivity.laps.map((x) => x.average_heartrate),
        borderColor: 'darkturquoise',
        backgroundColor: 'darkturquoise',
      };

      setData({
        labels: props.currentActivity.laps.map(
          (increment) =>
            (cumulativeDistance +=
              increment.distance *
              (() => {
                if (props.format === 'avgypace') {
                  return 1.094;
                }
                return 1;
              })()).toFixed() + ` ${currentMeasurement}`
        ),
        datasets: (() => {
          if (hrData.includes('maxHR') && hrData.includes('avgHR')) {
            return [maxHeartRateDataSet, averageHeartRateDataSet];
          }
          if (hrData.includes('maxHR')) {
            return [maxHeartRateDataSet];
          }

          if (hrData.includes('avgHR')) {
            return [averageHeartRateDataSet];
          }

          return [];
        })(),
      });
    }
  }, [props.currentActivity.laps, hrData, props.format, currentMeasurement]);

  return data ? (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Line options={options} data={data} />
      <Box sx={{ display: 'flex' }}>
        <Button
          value="maxHR"
          onClick={() => {
            setHrData((prev) => {
              let ex = prev.slice(0);

              if (ex.includes('maxHR')) {
                ex.splice(ex.indexOf('maxHR'), 1);
              } else {
                ex.push('maxHR');
              }
              return ex;
            });
          }}
        >
          Max Heart Rate
        </Button>
        <Button
          value="avgHR"
          onClick={() => {
            setHrData((prev) => {
              let ex = prev.slice(0);
              if (ex.includes('avgHR')) {
                ex.splice(ex.indexOf('avgHR'), 1);
              } else {
                ex.push('avgHR');
              }
              return ex;
            });
          }}
        >
          Average Heart Rate
        </Button>
      </Box>
    </Box>
  ) : null;
};

export default HeartRateChart;
