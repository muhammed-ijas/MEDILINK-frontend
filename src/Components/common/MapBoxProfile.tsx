import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";

// Keyframes for bounce animation
const bounceAnimation = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const MyMap: React.FC<{ spInfo: { latitude: number; longitude: number } }> = ({ spInfo }) => {
  const [viewport, setViewport] = useState<any>({
    latitude: spInfo.latitude,
    longitude: spInfo.longitude,
    zoom: 14,
  });

  useEffect(() => {
    setViewport({
      latitude: spInfo.latitude,
      longitude: spInfo.longitude,
      zoom: 14,
    });
  }, [spInfo]);

  return (
    <div className="relative w-full h-60 md:h-80">
      <style>
        {bounceAnimation}
      </style>
      <Map
        mapboxAccessToken="pk.eyJ1IjoibXVoYW1tZWRpamFzIiwiYSI6ImNtMGtoZ284YjE2dDUyaXNnMXJhMHg0bWsifQ.dTQGex6dQXYEefm67ZB57A"
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11" // Ensure this URL is correct
        style={{ width: "100%", height: "100%" }}
        interactive={false} // Make map non-interactive
      >
        <Marker
          longitude={spInfo.longitude}
          latitude={spInfo.latitude}
          anchor="bottom" // Ensures the marker is placed correctly
        >
          <div style={{
            color: 'red',
            fontSize: '2rem',
            animation: 'bounce 2s infinite'
          }}>
            <FaMapMarkerAlt />
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MyMap;
