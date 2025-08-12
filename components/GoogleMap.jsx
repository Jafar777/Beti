'use client';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FaChevronCircleRight, FaChevronCircleLeft, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoPinOutline } from "react-icons/io5";


import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

const governorates = [
  { id: 'damascus', name: { en: 'Damascus', ar: 'دمشق' }, center: { lat: 33.510414, lng: 36.278336 }, zoom: 12 },
  { id: 'aleppo', name: { en: 'Aleppo', ar: 'حلب' }, center: { lat: 36.202105, lng: 37.134260 }, zoom: 12 },
  { id: 'homs', name: { en: 'Homs', ar: 'حمص' }, center: { lat: 34.732427, lng: 36.713695 }, zoom: 12 },
  { id: 'latakia', name: { en: 'Latakia', ar: 'اللاذقية' }, center: { lat: 35.517677, lng: 35.783104 }, zoom: 12 },
  { id: 'hama', name: { en: 'Hama', ar: 'حماة' }, center: { lat: 35.131774, lng: 36.757784 }, zoom: 12 },
  { id: 'tartus', name: { en: 'Tartus', ar: 'طرطوس' }, center: { lat: 34.895027, lng: 35.886651 }, zoom: 12 },
  { id: 'raqqa', name: { en: 'Raqqa', ar: 'الرقة' }, center: { lat: 35.959411, lng: 39.009446 }, zoom: 12 },
  { id: 'deir', name: { en: 'Deir ez-Zor', ar: 'دير الزور' }, center: { lat: 35.335880, lng: 40.139278 }, zoom: 12 },
  { id: 'hasakeh', name: { en: 'Al-Hasakah', ar: 'الحسكة' }, center: { lat: 36.507226, lng: 40.748927 }, zoom: 12 },
  { id: 'daraa', name: { en: 'Daraa', ar: 'درعا' }, center: { lat: 32.624903, lng: 36.102928 }, zoom: 12 },
  { id: 'idlib', name: { en: 'Idlib', ar: 'إدلب' }, center: { lat: 35.930109, lng: 36.633000 }, zoom: 12 },
  { id: 'sweida', name: { en: 'As-Suwayda', ar: 'السويداء' }, center: { lat: 32.708957, lng: 36.569584 }, zoom: 12 },
  { id: 'quneitra', name: { en: 'Quneitra', ar: 'القنيطرة' }, center: { lat: 33.125942, lng: 35.828098 }, zoom: 12 },
  { id: 'damascus-countryside', name: { en: 'Damascus Countryside', ar: 'ريف دمشق' }, center: { lat: 33.516667, lng: 36.300000 }, zoom: 10 },
];

const syriaBounds = {
  north: 37.3,
  south: 32.3,
  west: 35.6,
  east: 42.3
};

const roadmapStyles = [
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#444444" }]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [{ "visibility": "on" }]
  }
];

const satelliteStyles = [
  {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "weight": 1.5 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text",
    "stylers": [
      { "color": "#ffffff" },
      { "weight": 1.5 }
    ]
  }
];

export default function GoogleMapComponent({ properties = [] }) {

  const { data: session } = useSession();
  const router = useRouter();


  const [mapType, setMapType] = useState('roadmap');
  const [activeGov, setActiveGov] = useState('damascus');
  const [map, setMap] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const panelRef = useRef(null);
  const [mapStyles, setMapStyles] = useState(roadmapStyles);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const languageContext = useLanguage();
  const language = languageContext?.language || 'en';
  const translations = languageContext?.translations || {};
  const t = translations[language] || {};

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });
  const markerIcon = useMemo(() => ({
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "red",
    fillOpacity: 1,
    strokeColor: "#000",
    strokeWeight: 1,
    scale: 1.5,
    anchor: { x: 12, y: 22 }
  }), []);
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(syriaBounds.south, syriaBounds.west),
      new window.google.maps.LatLng(syriaBounds.north, syriaBounds.east)
    );

    map.panTo(governorates[0].center);
    map.setZoom(governorates[0].zoom);

    map.setOptions({
      restriction: {
        latLngBounds: bounds,
        strictBounds: true
      },
      minZoom: 6
    });

    setMap(map);
  }, []);

  const toggleMapType = () => {
    const newType = mapType === 'roadmap' ? 'hybrid' : 'roadmap';
    setMapType(newType);
    setMapStyles(newType === 'hybrid' ? satelliteStyles : roadmapStyles);
  };

  const zoomToGovernorate = (govId) => {
    const gov = governorates.find(g => g.id === govId);
    if (gov && map) {
      setActiveGov(govId);
      map.panTo(gov.center);
      map.setZoom(gov.zoom);
      setIsPanelOpen(false);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.panel-toggle-button')) return;
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  const handlePinClick = (property) => {
      setSelectedProperty(property);
    
  };

  return isLoaded ? (
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      {isPanelOpen && (
        <div
          ref={panelRef}
          className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-3 w-[200px] max-w-[80vw] transition-all duration-300"
        >
          <h3 className="font-bold text-gray-800 mb-2 text-center">
            {t.governorates || "المحافظات السورية"}
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto">
            {governorates.map(gov => (
              <button
                key={gov.id}
                onClick={() => zoomToGovernorate(gov.id)}
                className={`py-2 px-3 cursor-pointer rounded-md text-sm font-medium transition-colors ${activeGov === gov.id
                    ? 'bg-[#375171] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
              >
                {gov.name[language] || gov.name.en}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={togglePanel}
        className={`absolute z-10 bg-[#375171] p-2 rounded-full shadow-md hover:bg-[#2d4360] cursor-pointer panel-toggle-button ${isPanelOpen
            ? 'top-1/2 left-[216px] transform -translate-y-1/2'
            : 'top-1/2 left-4 transform -translate-y-1/2'
          }`}
        style={{ zIndex: 20 }}
      >
        {isPanelOpen ? (
          <FaChevronCircleLeft className="text-white text-xl" />
        ) : (
          <FaChevronCircleRight className="text-white text-xl" />
        )}
      </button>

      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{
          width: '100%',
          height: '500px'
        }}
        center={governorates.find(g => g.id === activeGov)?.center}
        zoom={governorates.find(g => g.id === activeGov)?.zoom}
        options={{
          mapTypeId: mapType,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          minZoom: 6,
          styles: mapStyles,
          gestureHandling: "greedy"
        }}
      >
        {properties.map(property => {
          const position = property.pinLocation || {
            lat: property.latitude,
            lng: property.longitude
          };

          return (
            <Marker
              key={property._id}
              position={position}
              onClick={() => handlePinClick(property)}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Classic red pin
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 40),
              }}
            />
          );
        })}

{selectedProperty && (
  <InfoWindow
    position={selectedProperty.pinLocation || {
      lat: selectedProperty.latitude,
      lng: selectedProperty.longitude
    }}
    onCloseClick={() => setSelectedProperty(null)}
    options={{ 
      maxWidth: 280,
      pixelOffset: new window.google.maps.Size(0, -40)
    }}
  >
    <div className="w-full max-w-[280px]">
      {/* Property Image */}
      <div className="relative h-40 w-full">
        {selectedProperty.images?.length > 0 ? (
          <Image
            src={selectedProperty.images[0]}
            alt={selectedProperty.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 90vw, 280px"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
            <span className="text-gray-500">{t.noImage || 'No Image'}</span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-3 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
          <h3 className="text-sm sm:text-md font-bold text-gray-800 line-clamp-2 sm:line-clamp-1">
            {selectedProperty.title}
          </h3>
          <span className="text-sm sm:text-md font-bold text-[#375171] whitespace-nowrap">
            ${selectedProperty.price?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-2 text-xs sm:text-sm">
          <FaMapMarkerAlt className="mr-1 text-[#375171] flex-shrink-0" />
          <span className="line-clamp-1">
            {selectedProperty.location}
          </span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm mb-2">
          <div className="flex items-center text-gray-600">
            <FaBed className="mr-1 text-[#375171] flex-shrink-0" />
            <span>{selectedProperty.bedrooms}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBath className="mr-1 text-[#375171] flex-shrink-0" />
            <span>{selectedProperty.bathrooms}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaRulerCombined className="mr-1 text-[#375171] flex-shrink-0" />
            <span>{selectedProperty.area} m²</span>
          </div>
        </div>

        <button
          onClick={() => router.push(`/properties/${selectedProperty._id}`)}
          className="w-full bg-[#375171] hover:bg-[#2d4360] text-white py-1.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer"
        >
          {t.viewDetails || 'View Details'}
        </button>
      </div>
    </div>
  </InfoWindow>
)}
      </GoogleMap>

      <button
        onClick={toggleMapType}
        className="absolute top-4 right-4 bg-[#375171] hover:bg-[#2d4360] text-white px-4 py-2 rounded-lg z-10 cursor-pointer"
      >
        {mapType === 'roadmap' ? t.satelliteView : t.mapView}
      </button>
    </div>
  ) : (
    <div className="bg-gray-200 w-full h-[500px] flex items-center justify-center rounded-xl">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#375171] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>{t.loadingMap || "جاري تحميل الخريطة..."}</p>
      </div>
    </div>
  );
}