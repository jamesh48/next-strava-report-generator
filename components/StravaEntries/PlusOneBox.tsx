import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Slide } from '@mui/material';

interface PlusOneBoxProps {
  cachedCount: number;
  incomingCount?: number;
}

const PlusOneBox = (props: PlusOneBoxProps) => {
  const containerRef = useRef();

  const [isVisible, setIsVisible] = useState(false);
  const setPlusOne = (state: boolean) => {
    setIsVisible(state);
  };

  useEffect(() => {
    if (!props.incomingCount && props.incomingCount !== 0) {
      return;
    }
    // Kudos Count is a string for some reason
    if (Number(props.cachedCount) !== Number(props.incomingCount)) {
      setPlusOne(true);
      setTimeout(() => setPlusOne(false), 1500);
    }
  }, [props.cachedCount, props.incomingCount]);

  let color, content;
  if (props.incomingCount || props.incomingCount === 0) {
    color = props.incomingCount > props.cachedCount ? 'lightgreen' : 'red';
    content =
      props.incomingCount > props.cachedCount
        ? `+${props.incomingCount - props.cachedCount}`
        : `-${props.cachedCount - props.incomingCount}`;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '2rem',
        width: '2rem',
      }}
    >
      {isVisible && props.incomingCount !== props.cachedCount ? (
        <Slide
          in
          container={containerRef.current}
          direction="up"
          timeout={1000}
        >
          <Box
            sx={{
              border: '1px solid ' + color,
              borderRadius: '50%',
              height: '1rem',
              width: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '.33rem',
              marginLeft: '.25rem',
              top: 0,
            }}
            className="risingElement"
          >
            <Typography color={color}>{content}</Typography>
          </Box>
        </Slide>
      ) : null}
    </Box>
  );
};

export default PlusOneBox;
