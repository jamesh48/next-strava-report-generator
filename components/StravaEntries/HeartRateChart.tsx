import { Line } from 'react-chartjs-2';

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

  let data;

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

    data = {
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
      datasets: [maxHeartRateDataSet, averageHeartRateDataSet],
    };
  }

  return data ? <Line options={options} data={data} /> : null;
};

export default HeartRateChart;
