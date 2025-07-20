'use client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';

const SinglePropertyMap = ({ position, zoom = 15 }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const markerIcon = useMemo(() => ({
    path: "M10,0C4.5,0,0,4.5,0,10s10,20,10,20s10-14.5,10-20S15.5,0,10,0z M10,15c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S12.8,15,10,15z",
    fillColor: "red",
    fillOpacity: 1,
    strokeColor: "#000",
    strokeWeight: 1,
    scale: 1.5,
    anchor: { x: 10, y: 20 }
  }), []);

  if (!isLoaded) {
    return <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={position}
      zoom={zoom}
      options={{
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        gestureHandling: "greedy",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      <Marker position={position} icon={markerIcon} />
    </GoogleMap>
  );
};

export default SinglePropertyMap;