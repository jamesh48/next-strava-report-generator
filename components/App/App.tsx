import React from 'react';
import Radios from '../OptionsProfile/Radios/Radios';
import UserProfile from '../UserProfile/UserProfile';
import { useGlobalContext } from '../GlobalStore/globalStore';
// import reportTestData from "../../backend/testData/entryTestData";
import Report from '../StravaEntries/Report';
import { getUserActivities } from '../../lib/AppUtils';
import { Box } from '@mui/material';
import { Format } from '../StravaEntries/EntryTypes';
import { useCSX } from '../GlobalStore/globalUtils';

export default function App() {
  const [{}, globalDispatch] = useGlobalContext();
  // Radios
  const [sport, setSport] = React.useState('Run');
  const [format, setFormat] = React.useState<Format>('kph');
  const [titleQuery, setTitleQuery] = React.useState('');
  const [fromDateQuery, setFromDateQuery] = React.useState('');
  const [toDateQuery, setToDateQuery] = React.useState('');
  const [distance, setDistance] = React.useState(0);
  const [customDistance, setCustomDistance] = React.useState(false);

  componentDidMount: React.useEffect(() => {
    document.title = 'Strava Report Generator';
    const fetchEntries = async () => {
      const returningEntries = await getUserActivities();
      // const returningEntries = reportTestData;
      globalDispatch({
        type: 'SET TOTAL ENTRIES',
        payload: returningEntries,
      });
    };
    fetchEntries();
  }, []);

  reset_distance_on_sport_change: React.useEffect(() => {
    setDistance(0);
  }, [sport]);

  reset_format_on_sport_change: React.useEffect(() => {
    setFormat(sport === 'Run' ? 'kph' : sport === 'Swim' ? 'avgmpace' : 'kph');
  }, [sport]);

  reset_checked_on_sport_change: React.useEffect(() => {
    setCustomDistance(false);
  }, [sport]);

  const setSportCallback: React.MouseEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value;
    setSport(value);
  };

  const setFormatCallback: React.MouseEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value;
    setFormat(value as Format);
  };

  const setTitleQueryCallback: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setTitleQuery(event.currentTarget.value);
  };

  const setFromDateQueryCallback: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFromDateQuery(event.currentTarget.value);
  };

  const setToDateQueryCallback: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setToDateQuery(event.currentTarget.value);
  };

  const setDistanceCallback: React.MouseEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const placeholder = (e.target as HTMLInputElement).placeholder;

    setDistance(Number(value));

    if (placeholder === 'Custom Distance' && Number(value) !== 0) {
      setCustomDistance(true);
    } else {
      setCustomDistance(false);
    }
  };

  const mainStyles = useCSX('100%', 'unset', 'width');

  return (
    <Box id="mainContainer" sx={{ ...mainStyles }}>
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
          setFromDateQuery={setFromDateQueryCallback}
          setToDateQuery={setToDateQueryCallback}
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
          fromDateQuery={fromDateQuery}
          toDateQuery={toDateQuery}
        />
      </Box>
    </Box>
  );
}
