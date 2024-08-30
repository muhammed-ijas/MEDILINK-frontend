import { useState, useEffect, useCallback } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";

export interface AddressData {
  fullAddress: string;
  area: string;
  city: string;
  state: string;
  district: string;
  postcode: string;
  longitude: number;
  latitude: number;
}

interface MapProps {
  onAddressSelect: (address: AddressData) => void;
  isEditMode: boolean;
}

const MyMap: React.FC<MapProps> = ({ onAddressSelect, isEditMode }) => {
  const [viewport, setViewport] = useState<any>({
    latitude: 0,
    longitude: 0,
    zoom: 14,
  });
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const [userAddress, setUserAddress] = useState<AddressData>({
    fullAddress: "",
    area: "",
    city: "",
    state: "",
    district: "",
    postcode: "",
    longitude: 0,
    latitude: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setViewport({
          latitude,
          longitude,
          zoom: 14,
        });
        setUserLocation({ latitude, longitude });
        getAddress(longitude, latitude);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
  }, []);

  const getAddress = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiYWtwcmFuYXZ5YWRhdiIsImEiOiJjbHdvZ2l0bHMwbDZ4MnFsYmRpejd4ZHpjIn0.SKiqLTKi43cqyMe7j0Re6A`
      );
      const data = await response.json();
      if (data.features.length > 0) {
        const place = data.features[0];
        const address = place.place_name;
        const area = place.context?.find((context: any) => context.id.includes("locality"))?.text ?? "";
        const city = place.context?.find((context: any) => context.id.includes("place"))?.text ?? "";
        const state = place.context?.find((context: any) => context.id.includes("region"))?.text ?? "";
        const district = place.context?.find((context: any) => context.id.includes("district"))?.text ?? "";
        const postcode = place.context?.find((context: any) => context.id.includes("postcode"))?.text ?? "";

        setUserAddress({
          fullAddress: address,
          area,
          city,
          state,
          district,
          postcode,
          longitude: lng,
          latitude: lat,
        });
      }
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    }
  };

  const handleMapClick = useCallback(
    (event) => {
      if (isEditMode) { // Allow location change only if in edit mode
        const { lngLat } = event;
        const longitude = lngLat.lng;
        const latitude = lngLat.lat;

        setUserLocation({ latitude, longitude });
        getAddress(longitude, latitude);
      }
    },
    [isEditMode]
  );

  return (
    <div className="relative w-full h-60 md:h-80"> {/* Adjusted height */}
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="absolute top-16 md:top-4 left-4 z-10 bg-white p-4 rounded-md shadow-md max-w-sm">
            <h2 className="text-md md:text-lg font-semibold mb-2">Your Location</h2>
            {userAddress.fullAddress ? (
              <div className="space-y-1">
                <p className="font-medium">{userAddress.area}</p>
                <p>{userAddress.city}, {userAddress.district}</p>
                <p>{userAddress.state}, {userAddress.postcode}</p>
              </div>
            ) : (
              <p>Your location is being fetched...</p>
            )}
          </div>

          <Map
            mapboxAccessToken="pk.eyJ1IjoiYWtwcmFuYXZ5YWRhdiIsImEiOiJjbHdvZ2l0bHMwbDZ4MnFsYmRpejd4ZHpjIn0.SKiqLTKi43cqyMe7j0Re6A"
            {...viewport}
            onMove={(evt) => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onClick={handleMapClick}
            style={{ width: "100%", height: "100%" }}
            interactive={isEditMode} // Disable map interactions if not in edit mode
          >
            {userLocation && (
              <Marker
                longitude={userLocation.longitude}
                latitude={userLocation.latitude}
              >
                <div className="text-red-600 text-4xl animate-bounce">
                  <FaMapMarkerAlt />
                </div>
              </Marker>
            )}
          </Map>
        </>
      )}
    </div>
  );
}

export default MyMap;
