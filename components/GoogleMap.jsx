'use client';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useState, useCallback, useRef, useEffect } from 'react';
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import { useLanguage } from '@/context/LanguageContext';

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
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeGov === gov.id 
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
        className={`absolute z-10 bg-[#375171] p-2 rounded-full shadow-md hover:bg-[#2d4360] panel-toggle-button ${
          isPanelOpen 
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
              icon={{
                path: "M10,0C4.5,0,0,4.5,0,10s10,20,10,20s10-14.5,10-20S15.5,0,10,0z M10,15c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S12.8,15,10,15z",
                fillColor: property.isFeatured ? "gold" : "red",
                fillOpacity: 1,
                strokeColor: "#000",
                strokeWeight: 1,
                scale: 1.5,
                anchor: new window.google.maps.Point(10, 20),
              }}
              onClick={() => setSelectedProperty(property)}
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
          >
            <div className="max-w-xs p-2">
              <h3 className="font-bold text-lg mb-1">{selectedProperty.title}</h3>
              <p className="text-gray-700">${selectedProperty.price?.toLocaleString()}</p>
              <p className="text-gray-600 mb-2">{selectedProperty.location}</p>
              <a 
                href={`/properties/${selectedProperty._id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      <button
        onClick={toggleMapType}
        className="absolute top-4 right-4 bg-[#375171] hover:bg-[#2d4360] text-white px-4 py-2 rounded-lg z-10"
      >
        {mapType === 'roadmap' ? t.satelliteView : t.mapView}
      </button>
    </div>
  ) : (
    <div className="bg-gray-200 w-full h-[500px] flex items-center justify-center rounded-xl">
      <p>{t.loadingMap || "جاري تحميل الخريطة..."}</p>
    </div>
  );
}