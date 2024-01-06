import React from 'react';
import { Box } from '@mui/material';
//
import UserProfile from '@components/UserProfile/UserProfile';
// import reportTestData from "../../backend/testData/entryTestData";
import Report from '@components/StravaEntries/Report';
import { Format, Sport } from '@components/StravaEntries/EntryTypes';
import {
  getSportCondition,
  setSportCondition,
  useGetAllEntriesQuery,
} from '@redux/slices';
import Radios from '@components/OptionsProfile/Radios/Radios';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import PopupModal from './PopupModal';

export default function App() {
  // Radios
  const sport = useSelector(getSportCondition);
  const dispatch = useDispatch();
  const [format, setFormat] = React.useState<Format>('kph');
  const [titleQuery, setTitleQuery] = React.useState('');

  const [distance, setDistance] = React.useState(0);
  const [customDistance, setCustomDistance] = React.useState(false);

  useGetAllEntriesQuery(null);

  reset_distance_on_sport_change: React.useEffect(() => {
    setDistance(0);
  }, [sport]);

  reset_format_on_sport_change: React.useEffect(() => {
    setFormat(sport === 'Run' ? 'kph' : sport === 'Swim' ? 'avgmpace' : 'kph');
  }, [sport]);

  reset_checked_on_sport_change: React.useEffect(() => {
    setCustomDistance(false);
  }, [sport]);

  const setSportCallback: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = (e.target as HTMLInputElement).value as Sport;
    dispatch(setSportCondition(value));
  };

  const setFormatCallback: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = (e.target as HTMLInputElement).value;
    setFormat(value as Format);
  };

  const setTitleQueryCallback: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setTitleQuery(event.currentTarget.value);
  };

  const setDistanceCallback: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const placeholder = (e.target as HTMLInputElement).placeholder;
    let value = (e.currentTarget as HTMLInputElement).value;
    if (!value) {
      value = (e.target as HTMLInputElement).value;
    }

    setDistance(Number(value));

    if (placeholder === 'Custom Distance' && Number(value) !== 0) {
      setCustomDistance(true);
    } else {
      setCustomDistance(false);
    }
  };

  return (
    <Box id="mainContainer">
      <Box
        id="upperSection"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '95%',
          margin: '2.5% auto',
          paddingTop: '25px',
          border: '1px solid coral',
          boxShadow: '0 0 10px coral',
          backgroundColor: 'darkturquoise',
        }}
      >
        <UserProfile />

        <Radios
          setSport={setSportCallback}
          setDistance={setDistanceCallback}
          setFormat={setFormatCallback}
          setTitleQuery={setTitleQueryCallback}
          titleQuery={titleQuery}
          sport={sport}
          customDistance={customDistance}
          distance={distance}
          format={format}
        />
        <Report
          sport={sport}
          format={format}
          distance={distance}
          titleQuery={titleQuery}
        />
      </Box>
      <PopupModal />
    </Box>
  );
}
