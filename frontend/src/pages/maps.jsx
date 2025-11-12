import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "50vh",
};

const googleApiKey = "AIzaSyDjyRoO4ogCeRr9IMw9LXYFL-y2HuxjZKg";

const LiveLocationPicker = ({ address, setAddress, setFormData }) => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: googleApiKey });

  const [userLocation, setUserLocation] = useState(null);
  const [marker, setMarker] = useState(null);

  // Fetch address for lat/lng
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`
      );
      const data = await res.json();
      if (data.results.length > 0) {
        setFormData(prev => ({...prev, address:data.results[0].formatted_address}))
        setAddress(data.results[0].formatted_address);
      }
      else setAddress("Address not found");
    } catch (err) {
      setAddress("Error fetching address");
    }
  };

  // Track live user location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation not supported by your browser");
    }
  }, []);

  // Handle map click to place marker
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log(lat, lng)
    setFormData(prev => ({ ...prev, lat, lng }));
    setMarker({ lat, lng });
    fetchAddress(lat, lng);
  }, []);

  // Handle marker drag
  const onMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });

    fetchAddress(lat, lng);
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || { lat: 28.6139, lng: 77.209 }}
        zoom={userLocation ? 15 : 5}
        onClick={onMapClick}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {/* User's live location as blue dot */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }}
            clickable={false}
          />
        )}

        {/* Draggable marker for selecting location */}
        {marker && (
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>

      <div style={{ marginTop: "10px" }}>
        <strong>Selected Address:</strong> {address || "Click on map to select"}
      </div>

      <button
        onClick={() => {
          if (userLocation) {
            setMarker(userLocation);
            fetchAddress(userLocation.lat, userLocation.lng);
          }
        }}
        style={{ marginTop: "10px" }}
      >
        Set Marker to My Location
      </button>
    </div>
  );
};

export default LiveLocationPicker;
