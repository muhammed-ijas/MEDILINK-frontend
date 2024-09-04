import { useState, useEffect, useCallback } from "react";
import Map, { Marker} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

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
}

const MyMap: React.FC<MapProps> = ({ onAddressSelect }) => {
  const [viewport, setViewport] = useState<any>({
    latitude: 0,
    longitude: 0,
    zoom: 3.5,
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setViewport((prevViewport:any) => ({
          ...prevViewport,
          latitude,
          longitude,
          zoom: 14,
        }));
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

  const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
    const { lngLat } = event;
    const longitude = lngLat.lng;
    const latitude = lngLat.lat;

    setUserLocation({ latitude, longitude });
    getAddress(longitude, latitude);
  }, []);

  const getAddress = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoibXVoYW1tZWRpamFzIiwiYSI6ImNtMGtoZ284YjE2dDUyaXNnMXJhMHg0bWsifQ.dTQGex6dQXYEefm67ZB57A`
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

  const handleDoneClick = () => {
    onAddressSelect(userAddress);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=pk.eyJ1IjoiYWtwcmFuYXZ5YWRhdiIsImEiOiJjbHdvZ2l0bHMwbDZ4MnFsYmRpejd4ZHpjIn0.SKiqLTKi43cqyMe7j0Re6A`
      );
      const data = await response.json();
      if (data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setViewport((prevViewport:any) => ({
          ...prevViewport,
          latitude: lat,
          longitude: lng,
          zoom: 14,
        }));
        setUserLocation({ latitude: lat, longitude: lng });
        getAddress(lng, lat);
      }
    } catch (error) {
      console.error("Failed to search location:", error);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="absolute top-16 md:top-4 left-4 z-10 bg-white p-4 rounded-md shadow-md max-w-sm">
            <h2 className=" text-md md:text-lg font-semibold mb-2">Your Location</h2>
            {userAddress.fullAddress ? (
              <div className="space-y-1">
                <p className="font-medium">{userAddress.area}</p>
                <p>{userAddress.city}, {userAddress.district}</p>
                <p>{userAddress.state}, {userAddress.postcode}</p>
                <button
                  onClick={handleDoneClick}
                  className="mt-2 px-4 py-1 bg-black text-white rounded-sm hover:bg-gray-800 transition duration-300"
                >
                  Save Address
                </button>
              </div>
            ) : (
              <p>Select a location on the map</p>
            )}
          </div>

          <form onSubmit={handleSearch} className="absolute top-4 right-4 z-10">
            <div className="flex items-center bg-white rounded-lg shadow-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location"
                className="px-4 py-2 rounded-l-lg focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition duration-300">
                <FaSearch />
              </button>
            </div>
          </form>

          <Map
            mapboxAccessToken="pk.eyJ1IjoiYWtwcmFuYXZ5YWRhdiIsImEiOiJjbHdvZ2l0bHMwbDZ4MnFsYmRpejd4ZHpjIn0.SKiqLTKi43cqyMe7j0Re6A"
            {...viewport}
            onMove={(evt) => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onClick={handleMapClick}
            style={{ width: "100%", height: "100%" }}
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