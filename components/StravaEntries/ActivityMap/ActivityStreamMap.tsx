import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box } from '@mui/material';
import MapManager from './MapManager';
import { useSelector } from '@redux/reduxHooks';
import { getClientSideToken } from '@redux/slices';
import axios from 'axios';
import { useCSX } from '@lib';

interface ActivityMapProps {
  startIndex?: number;
  endIndex?: number;
  activityId?: number;
}

const ActivityStreamMap = (props: ActivityMapProps) => {
  const [activityStream, setActivityStream] = useState<number[][]>([]);
  const mapboxAccessToken = useSelector(getClientSideToken('mapbox'));
  mapboxgl.accessToken = mapboxAccessToken;
  const mapContainer = useRef(null);
  const map: React.MutableRefObject<MapManager> = useRef({} as MapManager);

  useEffect(() => {
    if (props.activityId) {
      const fetchActivityStream = async () => {
        const { data } = await axios<{ latlng: { data: number[][] } }>({
          url: '/api/activityStream',
          method: 'GET',
          params: { activityId: props.activityId },
        });
        setActivityStream(data.latlng.data);
      };

      fetchActivityStream();
    }
  }, [props.activityId]);

  useEffect(() => {
    if (!mapboxgl.accessToken) return; // initialize map only if token exists
    if (!activityStream.length) return;

    const coordinates = activityStream
      .map((point) => [point[1], point[0]])
      .reverse();
    // Calculate the southwest and northeast corners of the bounding Box
    const southwest = [
      Math.min(...coordinates.map((coord) => coord[0])) + 0.01,
      Math.min(...coordinates.map((coord) => coord[1])) - 0.01,
    ] as [number, number];
    const northeast = [
      Math.max(...coordinates.map((coord) => coord[0])) - 0.01,
      Math.max(...coordinates.map((coord) => coord[1])) + 0.01,
    ] as [number, number];

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
            coordinates: coordinates.slice(props.startIndex, props.endIndex),
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
      map.current.resize();
    });

    return () => map.current.remove();
  }, [activityStream, props.startIndex, props.endIndex]);

  const mobileStyles = useCSX(
    { width: '50%', height: '30rem' },
    { width: '100%', height: '60%' }
  );
  return (
    <Box
      ref={mapContainer}
      sx={{
        ...mobileStyles,
        // '.mapboxgl-canvas-container': canvasContainerWidth as CSSProperties,
      }}
    />
  );
};

export default ActivityStreamMap;
