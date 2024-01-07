import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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

import { Box, Link, TextField, Typography } from '@mui/material';
import { CurrentActivity, Format } from './EntryTypes';
import { useLazyGetKudoersQuery } from '@redux/slices';
import { useCSX } from '@lib';

export interface DetailedEntryProps {
  editing: boolean;
  editedDescription: string;
  currentActivity: CurrentActivity;
  handleEditingChange: React.MouseEventHandler<HTMLAnchorElement>;
  handleDescriptionChange: (e: { target: { value: string } }) => void;
  handleActivityUpdate: () => void;
  format: Format;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DetailedEntry = (props: DetailedEntryProps) => {
  const [getKudoers, kudoersResults] = useLazyGetKudoersQuery();
  const [currentStat, setCurrentStat] = useState<null | string>(null);
  const [currentKudoers, setCurrentKudoers] = useState<
    { firstname: string; lastname: string }[]
  >([]);
  const [currentComments, setCurrentComments] = useState<
    {
      text: string;
      athlete: { firstname: string; lastname: string };
    }[]
  >([]);

  useEffect(() => {
    if (kudoersResults && kudoersResults.data) {
      setCurrentKudoers(kudoersResults.data.kudos);
      setCurrentComments(kudoersResults.data.comments);
    }
  }, [kudoersResults]);

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

  let data;
  const currentMeasurement = (() => {
    if (props.format === 'avgypace') {
      return 'yds';
    }
    return 'mtrs';
  })();

  if (props.currentActivity.laps) {
    let cumulativeDistance = 0;

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
      datasets: [
        {
          label: 'Max Heart Rate',
          data: props.currentActivity.laps.map((x) => x.max_heartrate),
          borderColor: 'red',
          backgroundColor: 'red',
        },
        {
          label: 'Average Heart Rate',
          data: props.currentActivity.laps.map((x) => x.average_heartrate),
          borderColor: 'darkturquoise',
          backgroundColor: 'darkturquoise',
        },
      ],
    };
  }

  const handleKudosClick = () => {
    getKudoers(props.currentActivity.id);
    setCurrentStat((prevStat) => {
      if (prevStat === 'kudosComments') {
        return null;
      }
      return 'kudosComments';
    });
  };

  const mobileColumns = useCSX('row', 'column', 'flexDirection');

  return (
    <Box
      className="detailedEntry"
      sx={{
        backgroundColor: 'coral',
        border: '2px solid orangered',
        display: 'flex',
        flexDirection: 'column',
        textRendering: 'geometricPrecision',
        '& > p': {
          paddingLeft: '1.5%',
        },
      }}
    >
      {/* Description */}
      <Box
        className="topActivityDescription"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginX: '1%',
          marginBottom: '1%',
        }}
      >
        <Typography variant="h6" sx={{ color: 'ivory' }}>
          Activity Description:
        </Typography>
        {props.editing ? (
          <TextField
            multiline
            rows={20}
            value={props.editedDescription}
            onChange={props.handleDescriptionChange}
            sx={{ width: '90%', alignSelf: 'center', display: 'flex' }}
            InputProps={{ sx: { color: 'ivory' } }}
          />
        ) : (
          <Typography
            className="topActivityDescription"
            sx={{
              color: 'ivory',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginX: '1%',
              marginBottom: '1%',
              whiteSpace: 'pre-line',
              border: '1px solid ivory',
              padding: '1rem',
            }}
          >
            {props.currentActivity.description}
          </Typography>
        )}
      </Box>
      <Box
        id="funStats"
        sx={{
          display: 'flex',
          marginLeft: '2.5%',

          ...mobileColumns,
        }}
      >
        {/* Kudos & Comments */}
        <Box
          id="kudosX"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flex: 1,
          }}
        >
          <Image
            height={50}
            width={50}
            alt="kudos-img"
            layout="static"
            src="/images/kudos.jpeg"
            onClick={handleKudosClick}
          />
          <Box
            className="kudosDescriptors"
            sx={{
              paddingLeft: '2.5%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h6"
                id="kudosCount"
                className="kudos"
                sx={{
                  margin: 0,
                  display: 'block',
                  color: 'ivory',
                }}
              >
                Kudos-{' '}
              </Typography>
              <Typography sx={{ color: 'ivory' }} variant="h6">
                {props.currentActivity.kudos_count}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h6"
                id="commentCount"
                className="kudos"
                sx={{ margin: 0, display: 'block', color: 'ivory' }}
              >
                Comments-{' '}
              </Typography>
              <Typography variant="h6" sx={{ color: 'ivory' }}>
                {props.currentActivity.comment_count}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Heart Rate */}
        {props.currentActivity.average_heartrate ? (
          <Box
            id="goldenHeartRate"
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <Image
              alt="heart-rate"
              height={50}
              width={50}
              layout="static"
              src="/images/heartrate.png"
              onClick={() => {
                setCurrentStat((prevStat) => {
                  if (prevStat === 'heartRate') {
                    return null;
                  }
                  return 'heartRate';
                });
              }}
            />
            <Box
              className="heartRateDescriptors"
              sx={{ paddingLeft: '2.5%', flex: 1 }}
            >
              <Box sx={{ display: 'flex' }}>
                <Typography
                  id="avgHeartRate"
                  className="heartRate"
                  variant="h6"
                  sx={{
                    display: 'block',
                    color: 'ivory',
                    margin: 0,
                    width: '3rem',
                  }}
                >
                  Avg-{' '}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'ivory',
                  }}
                >{`${props.currentActivity.average_heartrate} bpm`}</Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  id="maxHeartRate"
                  className="heartRate"
                  sx={{
                    display: 'block',
                    color: 'ivory',
                    margin: 0,
                    width: '3rem',
                  }}
                  variant="h6"
                >
                  Max-{' '}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'ivory',
                  }}
                >{`${props.currentActivity.max_heartrate} bpm`}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            id="goldenHeartRate"
            sx={{
              display: 'flex',
            }}
          >
            <Image
              alt="heart-rate"
              height={50}
              width={50}
              src="/images/heartrate.png"
              layout="static"
            />
            <Typography
              className="heartRate"
              id="avgHeartRate"
              variant="h6"
              color="ivory"
              sx={{ paddingLeft: '1.5%', margin: 0 }}
            >
              <Typography>No HR Info Available</Typography>
            </Typography>
            <Typography
              variant="h6"
              className="heartRate"
              id="maxHeartRate"
              sx={{ display: 'inline-block', margin: 0 }}
            >
              <Typography sx={{ display: 'inline-block' }}></Typography>
            </Typography>
          </Box>
        )}

        {/* Trophy Case */}
        <Box
          id="trophyCase"
          sx={{
            display: 'flex',
            flex: 1,
          }}
        >
          <Image
            height={50}
            width={50}
            alt="trophy-img"
            src="/images/trophy.jpeg"
            layout="static"
          />
          <Box
            className="achievementCountDescriptor"
            sx={{ paddingLeft: '2.5%', flex: 1, display: 'flex' }}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h6"
                className="achievements"
                id="achievementCount"
                sx={{ color: 'ivory', margin: 0 }}
              >
                Achievement Count-
              </Typography>
              <Typography variant="h6" sx={{ color: 'ivory' }}>
                {props.currentActivity.achievement_count}
              </Typography>
            </Box>
          </Box>
        </Box>

        {props.currentActivity.photos.primary ? (
          <Image
            src={props.currentActivity.photos.primary.urls['600']}
            height={150}
            width={150}
            layout="fixed"
            alt="highlight-photo"
          />
        ) : null}
      </Box>
      {/* Gear */}
      <Box id="topActivityGear" sx={{ marginLeft: '1.5%', color: 'ivory' }}>
        <Typography>Gear: {props.currentActivity.device_name}</Typography>
      </Box>
      {
        <Box
          className="editingContainer"
          sx={{ alignSelf: 'flex-end', padding: '0.5% 1.25%' }}
        >
          {props.editing && (
            <Link
              className="editingLink"
              onClick={props.handleActivityUpdate}
              sx={{
                color: 'blue',
                textDecoration: 'none',
                marginRight: '10%',
                cursor: 'pointer',
                '&:hover': {
                  color: 'ivory',
                },
              }}
            >
              Submit!
            </Link>
          )}
          <Link
            className="editingLink"
            onClick={props.handleEditingChange}
            sx={{
              color: 'blue',
              textDecoration: 'none',
              marginRight: '10%',
              cursor: 'pointer',
              '&:hover': {
                color: 'ivory',
              },
            }}
          >
            {props.editing ? 'Cancel' : 'Edit'}
          </Link>
        </Box>
      }
      {currentStat === 'heartRate' && data ? (
        <Line options={options} data={data} />
      ) : currentStat === 'kudosComments' ? (
        <Box
          sx={{
            paddingLeft: '2.5%',
            color: 'ivory',
            display: 'flex',
            ...mobileColumns,
          }}
        >
          {currentKudoers.length ? (
            <Box sx={{ marginLeft: '1rem' }}>
              <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
                Kudoers
              </Typography>
              <Box>
                {currentKudoers.map((x, index) => (
                  <Typography key={index}>
                    {x.firstname} {x.lastname}
                  </Typography>
                ))}
              </Box>
            </Box>
          ) : null}
          {currentComments.length ? (
            <Box sx={{ marginLeft: '1rem' }}>
              <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
                Comments
              </Typography>
              <Box>
                {currentComments.map((x, index) => (
                  <Box key={index} sx={{ display: 'flex' }}>
                    <Typography>
                      {x.athlete.firstname} {x.athlete.lastname}:
                    </Typography>
                    <Typography>{x.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export default DetailedEntry;
