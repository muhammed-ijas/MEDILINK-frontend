import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import homenurseImage from "/logo/HomePage/homenurseImage.png";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "lodash";
import { useCallback } from "react";
import {
  getDepartments,
  getDoctors,
  getHospitals,
  getClinicks,
  getAmbulances,
  getHomeNurses,
} from "../../api/user";
import { useNavigate } from "react-router-dom";


const ITEMS_PER_PAGE = 10; // Define the number of items per page

interface Department {
  _id: string;
  name: string;
  serviceProvider: {
    name: string;
    area: string;
    city: string;
    district: string;
  };
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  department: {
    name: string;
  };
  phone: string;
  availableFrom: string;
  availableTo: string;
  ratings: Rating[]; 
  doctorProfileImage:string;
  // Adding ratings to Doctor interface
}

// interface Hospital {
//   _id: string;
//   name: string;
//   area: string;
//   city: string;
//   district: string;
//   phone: string;
//   profileImage: string;
// }

interface Rating {
  userId: string;
  rating: number;
  review: string;
  createdAt: string;
  _id: string;
}

interface Hospital {
  _id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
  ratings: Rating[];
}

interface Clinick {
  _id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
}

interface Ambulance {
  _id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
}

interface HomeNurse {
  _id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
}

interface ApiResult<T> {
  items: T[];
  totalPages: number;
}

const UserAppointments: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    | "departments"
    | "doctors"
    | "hospitals"
    | "clinicks"
    | "ambulances"
    | "homeNurses"
  >("departments");
  const [data, setData] = useState<
    Department[] | Doctor[] | Hospital[] | Clinick[] | Ambulance[] | HomeNurse[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [_loading, setLoading] = useState<boolean>(true); // Loading state

  const [_userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null); // User's location
  const [nearestData, setNearestData] = useState<any[]>([]); // To store nearest data



  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Debounced fetchData function
  const debouncedFetch = useCallback(
    debounce((searchValue) => {
      fetchData(searchValue); // Only call fetchData after a delay
    }, 1000), // 100ms delay - appo 1 second ayrkum 
    [activeFilter, currentPage] // Dependencies
  );

  const fetchData = async (searchTerm: string) => {
    setLoading(true); // Start loading

    let result:
      | ApiResult<Department>
      | ApiResult<Doctor>
      | ApiResult<Hospital>
      | ApiResult<Clinick>
      | ApiResult<Ambulance>
      | ApiResult<HomeNurse>;

    switch (activeFilter) {
      case "departments":
        result = await getDepartments(currentPage, ITEMS_PER_PAGE, searchTerm);
        break;
      case "doctors":
        result = await getDoctors(currentPage, ITEMS_PER_PAGE, searchTerm);
        break;
      case "hospitals":
        result = await getHospitals(currentPage, ITEMS_PER_PAGE, searchTerm);
        break;
      case "clinicks":
        result = await getClinicks(currentPage, ITEMS_PER_PAGE, searchTerm);
        break;
      case "ambulances":
        result = await getAmbulances(currentPage, ITEMS_PER_PAGE, searchTerm);
        break;
      case "homeNurses":
        result = await getHomeNurses(currentPage, ITEMS_PER_PAGE, searchTerm);
        break;
      default:
        result = { items: [], totalPages: 1 };
    }
    setData(result.items);
    setTotalPages(result.totalPages);
    setLoading(false); // End loading
  };


   // Function to get the user's location
   const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          calculateNearest(latitude, longitude); // Calculate nearest providers
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };


   // Haversine formula to calculate distance between two lat/lng points in km
   const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in kilometers
  };

  // Calculate nearest providers
  const calculateNearest = (userLat: number, userLng: number) => {
    const nearestProviders = data
      .map((provider: any) => {
        const distance = calculateDistance(userLat, userLng, provider.latitude, provider.longitude);
        return { ...provider, distance };
      })
      .sort((a, b) => a.distance - b.distance); // Sort by distance
    setNearestData(nearestProviders);
  };

  // Update search term and trigger debounced API call
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term
    debouncedFetch(value); // Call debounced fetch function
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [activeFilter, currentPage]);

  const handleFilterChange = (
    filter:
      | "departments"
      | "doctors"
      | "hospitals"
      | "clinicks"
      | "ambulances"
      | "homeNurses"
  ) => {
    setActiveFilter(filter);
    setCurrentPage(1); 
    setNearestData([]); // Clear nearest data

  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCardClick = (id: string, type: string) => {
    console.log("clicked button , ",id,type)

    if (type === "hospital" || type === "clinic") {
      navigate(`/user/hospitalClinicDetailedPage/${id}`);
    } else if (type === "department") {
      navigate(`/user/departmentDetailedPage/${id}`);
    } else if (type === "doctor") {
      navigate(`/user/doctorDetailedPage/${id}`);
    } else if (type === "ambulance") {
      navigate(`/user/ambulanceDetailedPage/${id}`);
    } else if (type === "homeNurse") {
      navigate(`/user/homeNurseDetailedPage/${id}`);
    }
  };

  return (
    <div>
      {/* Search Section */}
      <section className="relative  flex flex-col items-center mt-8">
        <motion.div
          className="flex flex-col items-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Bar */}
          <div className="relative w-full max-w-md mb-6">
            <input
              type="text"
              placeholder="Search for departments, doctors, hospitals, clinics..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              value={searchTerm}
              onChange={handleSearchChange} // Update searchTerm
            />

            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-5 h-5 text-gray-500" />
            </span>
          </div>

            {/* Show Nearest Button */}
      {activeFilter !== "departments" && activeFilter !== "doctors" && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          onClick={getUserLocation} // Get user's location
        >
          Show Nearest Providers
        </button>
      )}

          {/* Filter Buttons */}
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            <button
              className={`bg-white text-blue-800 px-6 py-2 rounded-full border-2 border-blue-600 shadow-lg transition-transform transform ${
                activeFilter === "homeNurses"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                  : "hover:bg-gray-200 hover:text-blue-800 hover:scale-105"
              }`}
              onClick={() => handleFilterChange("homeNurses")}
            >
              Home Nurses
            </button>

            <button
              className={`bg-white text-blue-800 px-6 py-2 rounded-full border-2 border-blue-600 shadow-lg transition-transform transform ${
                activeFilter === "ambulances"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                  : "hover:bg-gray-200 hover:text-blue-800 hover:scale-105"
              }`}
              onClick={() => handleFilterChange("ambulances")}
            >
              Ambulances
            </button>

            <button
              className={`bg-white text-blue-800 px-6 py-2 rounded-full border-2 border-blue-600 shadow-lg transition-transform transform ${
                activeFilter === "clinicks"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                  : "hover:bg-gray-200 hover:text-blue-800 hover:scale-105"
              }`}
              onClick={() => handleFilterChange("clinicks")}
            >
              Clinics
            </button>

            <button
              className={`bg-white text-blue-800 px-6 py-2 rounded-full border-2 border-blue-600 shadow-lg transition-transform transform ${
                activeFilter === "hospitals"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                  : "hover:bg-gray-200 hover:text-blue-800 hover:scale-105"
              }`}
              onClick={() => handleFilterChange("hospitals")}
            >
              Hospitals
            </button>

            <button
              className={`bg-white text-blue-800 px-6 py-2 rounded-full border-2 border-blue-600 shadow-lg transition-transform transform ${
                activeFilter === "departments"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                  : "hover:bg-gray-200 hover:text-blue-800 hover:scale-105"
              }`}
              onClick={() => handleFilterChange("departments")}
            >
              Departments
            </button>
            <button
              className={`bg-white text-blue-800 px-6 py-2 rounded-full border-2 border-blue-600 shadow-lg transition-transform transform ${
                activeFilter === "doctors"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-105"
                  : "hover:bg-gray-200 hover:text-blue-800 hover:scale-105"
              }`}
              onClick={() => handleFilterChange("doctors")}
            >
              Doctors
            </button>
          </div>
        </motion.div>
      </section>

      {/* Results Section */}
      <section className=" mt-11 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {nearestData && nearestData.length > 0 ? (
      nearestData.map((item) => (
        <div
          key={item._id}
          className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
          onClick={() => handleCardClick(item._id, item.serviceType)}
        >
          <img
            src={item.profileImage}
            alt="Provider"
            className="w-12 h-12 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
          <p className="mb-1">
            {item.area}, {item.city}, {item.district}
          </p>
          <p>{item.phone}</p>
          <p className="text-gray-500">
            {item.distance ? `${item.distance.toFixed(2)} km away` : "Distance not available"}
          </p>
        </div>
      ))
    ) : data && data.length > 0 ? (
            data.map(
              (
                item:
                  | Department
                  | Doctor
                  | Hospital
                  | Clinick
                  | Ambulance
                  | HomeNurse
              ) => {
                if (activeFilter === "homeNurses") {
                  return (
                    <div
                      key={(item as HomeNurse)._id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
                      onClick={() =>
                        handleCardClick((item as HomeNurse)._id, "homeNurse")
                      }
                    >
                      <img
                        src={(item as HomeNurse).profileImage}
                        alt="Provider"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(item as HomeNurse).name}
                      </h3>
                      <p className="mb-1">
                        {(item as HomeNurse).area}, {(item as HomeNurse).city},{" "}
                        {(item as HomeNurse).district}
                      </p>
                      <p>{(item as HomeNurse).phone}</p>
                    </div>
                  );
                }

                if (activeFilter === "ambulances") {
                  return (
                    <div
                      key={(item as Ambulance)._id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
                      onClick={() =>
                        handleCardClick((item as Ambulance)._id, "ambulance")
                      }
                    >
                      <img
                        src={(item as Ambulance).profileImage}
                        alt="Provider"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(item as Ambulance).name}
                      </h3>
                      <p className="mb-1">
                        {(item as Ambulance).area}, {(item as Ambulance).city},{" "}
                        {(item as Ambulance).district}
                      </p>
                      <p>{(item as Ambulance).phone}</p>
                    </div>
                  );
                }

                if (activeFilter === "clinicks") {
                  return (
                    <div
                      key={(item as Clinick)._id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
                      onClick={() =>
                        handleCardClick((item as Clinick)._id, "clinic")
                      }
                    >
                      <img
                        src={(item as Clinick).profileImage}
                        alt="Provider"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(item as Clinick).name}
                      </h3>
                      <p className="mb-1">
                        {(item as Clinick).area}, {(item as Clinick).city},{" "}
                        {(item as Clinick).district}
                      </p>
                      <p>{(item as Clinick).phone}</p>
                    </div>
                  );
                }
               

                if (activeFilter === "hospitals") {
                  const hospital = item as Hospital;

                  // Safely handle cases where ratings might be undefined
                  const ratings = hospital.ratings || [];
                  const totalRatings = ratings.length;
                  const averageRating = totalRatings
                    ? ratings.reduce(
                        (acc, ratingObj) => acc + ratingObj.rating,
                        0
                      ) / totalRatings
                    : 0;

                  // Function to render stars
                  const renderStars = (rating: number) => {
                    const fullStars = Math.floor(rating);
                    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
                    const emptyStars = 5 - fullStars - halfStar;

                    return (
                      <div className="flex">
                        {Array(fullStars)
                          .fill(0)
                          .map((_, index) => (
                            <span
                              key={`full-star-${index}`}
                              className="text-yellow-500"
                            >
                              ★
                            </span>
                          ))}
                        {halfStar === 1 && (
                          <span className="text-yellow-500">★</span>
                        )}
                        {Array(emptyStars)
                          .fill(0)
                          .map((_, index) => (
                            <span
                              key={`empty-star-${index}`}
                              className="text-gray-300"
                            >
                              ★
                            </span>
                          ))}
                      </div>
                    );
                  };

                  return (
                    <div
                      key={hospital._id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
                      onClick={() => handleCardClick(hospital._id, "hospital")}
                    >
                      <img
                        src={hospital.profileImage}
                        alt="Provider"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {hospital.name}
                      </h3>
                      <p className="mb-1">
                        {hospital.area}, {hospital.city}, {hospital.district}
                      </p>
                      <p>{hospital.phone}</p>

                      {/* Display average rating as stars */}
                      <div className="mt-2">
                        {renderStars(averageRating)}
                        {/* <p className="text-sm text-gray-500">{averageRating.toFixed(1)} out of 5</p> */}
                      </div>
                    </div>
                  );
                }

                if (activeFilter === "departments" && "name" in item) {
                  return (
                    <div
                      key={(item as Department)._id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
                      onClick={() =>
                        handleCardClick((item as Department)._id, "department")
                      }
                    >
                      <FontAwesomeIcon
                        icon={faBuilding} // Example icon
                        className="text-blue-500 text-3xl mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(item as Department).name}
                      </h3>
                      <p className="mb-1">
                        {(item as Department).serviceProvider?.name}
                      </p>
                      <p className="mb-1">
                        {(item as Department).serviceProvider?.area},{" "}
                        {(item as Department).serviceProvider?.city},{" "}
                        {(item as Department).serviceProvider?.district}
                      </p>
                    </div>
                  );
                }
                //for doctors
                if (activeFilter === "doctors" && "specialization" in item) {
                  const doctor = item as Doctor;

                  // Safely handle cases where ratings might be undefined
                  const ratings = doctor.ratings || [];
                  const totalRatings = ratings.length;
                  const averageRating = totalRatings
                    ? ratings.reduce(
                        (acc, ratingObj) => acc + ratingObj.rating,
                        0
                      ) / totalRatings
                    : 0;

                  // Function to render stars
                  const renderStars = (rating: number) => {
                    const fullStars = Math.floor(rating);
                    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
                    const emptyStars = 5 - fullStars - halfStar;

                    return (
                      <div className="flex">
                        {Array(fullStars)
                          .fill(0)
                          .map((_, index) => (
                            <span
                              key={`full-star-${index}`}
                              className="text-yellow-500"
                            >
                              ★
                            </span>
                          ))}
                        {halfStar === 1 && (
                          <span className="text-yellow-500">★</span>
                        )}
                        {Array(emptyStars)
                          .fill(0)
                          .map((_, index) => (
                            <span
                              key={`empty-star-${index}`}
                              className="text-gray-300"
                            >
                              ★
                            </span>
                          ))}
                      </div>
                    );
                  };

                  return (
                    <div
                      key={doctor._id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center cursor-pointer"
                      onClick={() => handleCardClick(doctor._id, "doctor")}
                    >
                      <img
                        src={doctor.doctorProfileImage}
                        alt="Doctor"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {doctor.name}
                      </h3>
                      <p className="mb-1">{doctor.specialization}</p>
                      <p className="mb-1">{doctor.department?.name}</p>
                      <p className="mb-1">{doctor.phone}</p>
                      <p className="mb-1">{doctor.availableFrom}</p>
                      <p className="mb-1">{doctor.availableTo}</p>

                      <div className="mt-2">{renderStars(averageRating)}</div>
                    </div>
                  );
                }

                return null;
              }
            )
          ) : (
            <p>No data available</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 mx-1 rounded-full transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>

      {/* Goals of Us Section */}
      <section className="relative p-8">
        {/* Background ClipPath */}
        <div
          className="absolute inset-0 bg-black opacity-90"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 60% 100%, 0 100%)",
            zIndex: -1, // Place behind content
          }}
        ></div>

        {/* Black Overlay for Image */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            clipPath: "polygon(0 50%, 100% 0, 100% 60%, 50% 100%, 0 100%)",
            zIndex: 0,
          }}
        ></div>

        <div className="flex items-center justify-between max-w-6xl mx-auto text-white relative z-10">
          {/* Text Section */}
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold mb-4">Our Goals</h2>
            <p className="text-lg">
              At Medilink, our goal is to transform the healthcare experience by
              seamlessly integrating a variety of services into a single,
              user-friendly platform. We are dedicated to continuously enhancing
              our offerings to better serve our users and partners. Our future
              plans include expanding our network of service providers,
              incorporating advanced features for more efficient service
              delivery, and ensuring a high standard of quality and reliability.
              We aim to be the go-to solution for all healthcare needs,
              fostering a healthier and more connected community.
            </p>
          </div>

          {/* Image Section */}
          <motion.div
            className="w-full md:w-1/2 p-4"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={homenurseImage}
              alt="Our Goals"
              className="w-full h-auto object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UserAppointments;
