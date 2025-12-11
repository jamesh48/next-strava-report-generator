import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import polyline from '@mapbox/polyline';
import { Box, IconButton, Tooltip } from '@mui/material';
import MapManager from './MapManager';
import { useSelector } from '@redux/reduxHooks';
import { getClientSideToken } from '@redux/slices';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

interface ActivityMapProps {
  polyline: string | undefined;
  activityId?: number;
}

const ActivityMap = (props: ActivityMapProps) => {
  const mapboxAccessToken = useSelector(getClientSideToken('mapbox'));
  mapboxgl.accessToken = mapboxAccessToken;
  const mapContainer = useRef(null);
  const map: React.MutableRefObject<MapManager> = useRef({} as MapManager);
  const originalBounds = useRef<[[number, number], [number, number]] | null>(null);

  useEffect(() => {
    if (!mapboxgl.accessToken) return; // initialize map only if token exists

    const latLong = polyline.decode(props.polyline || '');

    const coordinates = latLong.map((point) => [point[1], point[0]]);
    // Calculate the southwest and northeast corners of the bounding box
    const southwest = [
      Math.min(...coordinates.map((coord) => coord[0])) + 0.01,
      Math.min(...coordinates.map((coord) => coord[1])) - 0.01,
    ] as [number, number];
    const northeast = [
      Math.max(...coordinates.map((coord) => coord[0])) - 0.01,
      Math.max(...coordinates.map((coord) => coord[1])) + 0.01,
    ] as [number, number];

    // Store the original bounds for reset functionality
    originalBounds.current = [southwest, northeast];

    map.current = new MapManager({
      container: mapContainer.current || '',
      style: 'mapbox://styles/mapbox/streets-v12',
      bounds: [southwest, northeast],
      zoom: 9,
      initialTheme: 'dark',
      attributionControl: false,
    });

    map.current.on('load', () => {
      const zoneName = 'route';
      map.current.addSource(zoneName, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      });

      map.current.addLayer({
        id: zoneName + '_layer',
        type: 'line',
        source: zoneName,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'orangered',
          'line-width': 2.5,
          'line-opacity': 1,
        },
      });
      setTimeout(() => {
        if (map.current) {
          map.current?.resize();
        }
      }, 1000);
    });

    return () => map.current.remove();
  }, [props.polyline]);

  const handleResetView = () => {
    if (map.current && originalBounds.current) {
      map.current.fitBounds(originalBounds.current, {
        padding: 20,
        duration: 800,
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '25rem', width: '100%' }}>
      <Box
        ref={mapContainer}
        sx={{
          height: '100%',
          width: '100%',
          '.mapboxgl-canvas-container': {
            width: '100%',
            height: '100%',
          },
        }}
      />
      <Tooltip title="Reset map view" placement="left">
        <IconButton
          onClick={handleResetView}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <CenterFocusStrongIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActivityMap;
