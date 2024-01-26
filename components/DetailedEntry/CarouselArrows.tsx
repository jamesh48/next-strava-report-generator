import { Box, Button } from '@mui/material';

interface CarouselArrowsProps {
  position: number;
  changeEffort: (event: React.MouseEvent<HTMLElement>) => void;
  currentSegmentDataLength: number;
}

const CarouselArrows = (props: CarouselArrowsProps) => {
  return (
    <Box
      sx={{
        height: '5rem',
        flex: 1,
        display: 'flex',
        textAlign: 'center',
      }}
    >
      <Button
        className={`arrow-button prev-next-button`}
        id="prev-button"
        disabled={Number(props.position) - 1 < 0 ? true : false}
        onClick={props.changeEffort}
        sx={{
          flex: 1,
          position: 'relative',
          border: 'none',
          width: '5rem',
          height: '5rem',
          background: 'transparent',
          transform: 'rotate(180deg)',
          borderRadius: '50%',
          '&:disabled': {
            visibility: 'hidden',
          },
        }}
      >
        <svg
          className="arrow-button-icon"
          viewBox="0 0 100 100"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: '20%',
            top: '20%',
            height: '60%',
            width: '60%',
          }}
        >
          <path
            className="arrow"
            style={{
              fill: 'red',
              pointerEvents: 'none',
              opacity: 1,
            }}
            d="M33.8352105,100 C31.4906934,99.997936 29.2429547,99.0649124 27.5861629,97.4060557 C24.1379457,93.9535448 24.1379457,88.3604714 27.5861629,84.9079605 L62.6044109,49.8897124 L27.5861629,14.8714644 C24.3395013,11.3872106 24.4353002,5.95761395 27.8028539,2.59006023 C31.1704076,-0.777493487 36.6000043,-0.873292384 40.0842581,2.37336919 L87.6006014,49.8897124 L40.0842581,97.4060557 C38.4274663,99.0649124 36.1797276,99.997936 33.8352105,100 L33.8352105,100 Z"
          />
        </svg>
      </Button>
      <Button
        sx={{
          flex: 1,
          border: 'none',
          width: '5rem',
          height: '5rem',
          background: 'transparent',
          transform: 'rotate(180deg)',
          borderRadius: '50%',
          '&:disabled': {
            visibility: 'hidden',
          },
        }}
        className={`arrow-button prev-next-button`}
        id="next-button"
        disabled={
          Number(props.position) + 1 > props.currentSegmentDataLength - 1
            ? true
            : false
        }
        onClick={props.changeEffort}
      >
        <svg
          className="arrow-button-icon"
          viewBox="0 0 100 100"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: '20%',
            top: '20%',
            height: '60%',
            width: '60%',
          }}
        >
          <path
            className="arrow"
            style={{
              fill: 'red',
              pointerEvents: 'none',
              opacity: 1,
            }}
            d="M33.8352105,100 C31.4906934,99.997936 29.2429547,99.0649124 27.5861629,97.4060557 C24.1379457,93.9535448 24.1379457,88.3604714 27.5861629,84.9079605 L62.6044109,49.8897124 L27.5861629,14.8714644 C24.3395013,11.3872106 24.4353002,5.95761395 27.8028539,2.59006023 C31.1704076,-0.777493487 36.6000043,-0.873292384 40.0842581,2.37336919 L87.6006014,49.8897124 L40.0842581,97.4060557 C38.4274663,99.0649124 36.1797276,99.997936 33.8352105,100 L33.8352105,100 Z"
            transform="translate(100, 100) rotate(180)"
          />
        </svg>
      </Button>
    </Box>
  );
};

export default CarouselArrows;
