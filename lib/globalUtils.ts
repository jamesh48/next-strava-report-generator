import { SxProps } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { CSSProperties, useEffect, useState } from 'react';

export const useMobileBrowserCheck = () => {
  const [mobileBrowserState, setMobileBrowserState] = useState(false);

  useEffect(() => {
    const mobileBrowserCheck = () => {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
      ];
      return toMatch.some((toMatchItem) => {
        // Second condition works for iPads that display intel mac...
        return (
          navigator.userAgent.match(toMatchItem) ||
          (navigator.userAgent.indexOf('Macintosh') > -1 &&
            'ontouchend' in document)
        );
      });
    };

    setMobileBrowserState(mobileBrowserCheck());
  }, []);

  return mobileBrowserState;
};

type CSSPropertyIdentifier = keyof CSSProperties;

export function useCSX<T extends CSSPropertyIdentifier>(
  regularSx: SxProps | CSSProperties[T],
  mobileSx: SxProps | CSSProperties[T],
  identifier?: T
): SxProps {
  const isMobile = useMobileBrowserCheck();
  if (typeof identifier === 'string') {
    return isMobile ? { [identifier]: mobileSx } : { [identifier]: regularSx };
  } else {
    return (isMobile ? mobileSx : regularSx) as SxProps;
  }
}

export const authorizeApp = async () => {
  const response: AxiosResponse = await axios('/api/authLink');
  location = response.data;
};

export const fetchUserData = async () => {
  try {
    const { data } = await axios({
      url: '/api/loggedInUser',
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const typedErr = err as { message: string };
    if (typedErr.message.indexOf('429') === -1) {
      authorizeApp();
    } else {
      return 429;
    }
  }
};
