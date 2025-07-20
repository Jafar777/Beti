'use client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { IoPin } from "react-icons/io5";

export default function LocationPickerMap({ onLocationSelected, initialPosition }) {
  const [markerPosition, setMarkerPosition] = useState(initialPosition || { lat: 33.510414, lng: 36.278336 });
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarkerPosition(newPosition);
    onLocationSelected(newPosition);
  };

  return isLoaded ? (
    <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px]">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={markerPosition}
        zoom={15}
        onClick={handleMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={markerPosition}
          icon={{
            path: "M10,0C4.5,0,0,4.5,0,10s10,20,10,20s10-14.5,10-20S15.5,0,10,0z M10,15c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S12.8,15,10,15z",
            fillColor: "red",
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: 1,
            scale: 1.5,
            anchor: new window.google.maps.Point(10, 20),
          }}
        />
      </GoogleMap>

    </div>
  ) : (
    <div className="bg-gray-200 w-full h-[400px] flex items-center justify-center rounded-xl">
      <p>Loading map...</p>
    </div>
  );
}