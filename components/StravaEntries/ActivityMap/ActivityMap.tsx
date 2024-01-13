import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import polyline from '@mapbox/polyline';
import { Box } from '@mui/material';
import MapManager from './MapManager';
import { useSelector } from '@redux/reduxHooks';
import { getClientSideToken } from '@redux/slices';

interface ActivityMapProps {
  polyline: string;
}

const ActivityMap = (props: ActivityMapProps) => {
  const mapboxAccessToken = useSelector(getClientSideToken('mapbox'));
  mapboxgl.accessToken = mapboxAccessToken;
  const mapContainer = useRef(null);
  const map: React.MutableRefObject<MapManager> = useRef({} as MapManager);

  useEffect(() => {
    if (!mapboxgl.accessToken) return; // initialize map only if token exists
    const latLong = polyline.decode(props.polyline);
    const coordinates = latLong.map((point) => [point[1], point[0]]);
    // Calculate the southwest and northeast corners of the bounding box
    const southwest = [
      Math.min(...coordinates.map((coord) => coord[0])),
      Math.min(...coordinates.map((coord) => coord[1])),
    ] as [number, number];
    const northeast = [
      Math.max(...coordinates.map((coord) => coord[0])),
      Math.max(...coordinates.map((coord) => coord[1])),
    ] as [number, number];

    map.current = new MapManager({
      container: mapContainer.current || '',
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
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
          'line-width': 1,
          'line-opacity': 1,
        },
      });
    });

    return () => map.current.remove();
  }, [props.polyline]);

  return <Box ref={mapContainer} sx={{ height: '25rem', width: '66%' }}></Box>;
};

export default ActivityMap;
