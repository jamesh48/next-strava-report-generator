// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import React, { useEffect } from 'react';
type UseIntervalFunc = (callback: () => void, delay: number | null) => void;

const useInterval: UseIntervalFunc = (callback, delay) => {
  const savedCallback: React.MutableRefObject<any> = React.useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    // If victory is declared or bomb stop the timer...
    if (delay === -1) {
      // Tick one more time do set at 100;
      tick();
      return;
    }

    // Otherwise...
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
};

export default useInterval;
