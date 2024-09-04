import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import homenurseImage from "../../../public/logo/HomePage/homenurseImage.png";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getDepartments,
  getDoctors,
  getHospitals,
  getClinicks,
  getAmbulances,
  getHomeNurses,
} from "../../api/user";
import avatar from "../../../public/logo/HomePage/ProfileImage.png";

const ITEMS_PER_PAGE = 10; // Define the number of items per page

interface Department {
  id: string;
  name: string;
  serviceProvider: {
    name: string;
    area: string;
    city: string;
    district: string;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: {
    name: string;
  };
  phone: string;
  availableFrom: string;
  availableTo: string;
}

interface Hospital {
  id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
}

interface Clinick {
  id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
}
interface Ambulance {
  id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  phone: string;
  profileImage: string;
}
interface HomeNurse {
  id: string;
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

  const [searchTerm, setSearchTerm] = useState("");

  // const fetchData = async () => {
  //   let result:
  //     | ApiResult<Department>
  //     | ApiResult<Doctor>
  //     | ApiResult<Hospital>
  //     | ApiResult<Clinick>
  //     | ApiResult<Ambulance>
  //     | ApiResult<HomeNurse>;
  //   switch (activeFilter) {
  //     case "departments":
  //       result = await getDepartments(currentPage, ITEMS_PER_PAGE);
  //       console.log("departments : ", result);
  //       break;
  //     case "doctors":
  //       result = await getDoctors(currentPage, ITEMS_PER_PAGE);
  //       console.log("doctors : ", result);

  //       break;
  //     case "hospitals":
  //       result = await getHospitals(currentPage, ITEMS_PER_PAGE);
  //       console.log("hospitals : ", result);

  //       break;
  //     case "clinicks":
  //       result = await getClinicks(currentPage, ITEMS_PER_PAGE);
  //       console.log("clinicks : ", result);

  //       break;
  //     case "ambulances":
  //       result = await getAmbulances(currentPage, ITEMS_PER_PAGE);
  //       console.log("ambulances : ", result);

  //       break;
  //     case "homeNurses":
  //       result = await getHomeNurses(currentPage, ITEMS_PER_PAGE);
  //       console.log("homeNurses : ", result);

  //       break;
  //     default:
  //       result = { items: [], totalPages: 1 }; // Default value
  //   }
  //   setData(result.items);
  //   setTotalPages(result.totalPages);
  // };

  const fetchData = async (searchTerm: string) => {
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
  };

  // useEffect(() => {
  //   fetchData();
  // }, [activeFilter, currentPage]);

  useEffect(() => {
    fetchData(searchTerm);
  }, [activeFilter, currentPage, searchTerm]);

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
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            {/* <input
              type="text"
              placeholder="Search for departments, doctors, hospitals, clinics..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            /> */}
            <input
              type="text"
              placeholder="Search for departments, doctors, hospitals, clinics..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm
            />

            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-5 h-5 text-gray-500" />
            </span>
          </div>

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
          {data.length > 0 ? (
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
                      key={(item as HomeNurse).id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
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
                      key={(item as Ambulance).id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
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
                      key={(item as Clinick).id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
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
                  return (
                    <div
                      key={(item as Hospital).id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
                    >
                      <img
                        src={(item as Hospital).profileImage}
                        alt="Provider"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(item as Hospital).name}
                      </h3>
                      <p className="mb-1">
                        {(item as Hospital).area}, {(item as Hospital).city},{" "}
                        {(item as Hospital).district}
                      </p>
                      <p>{(item as Hospital).phone}</p>
                    </div>
                  );
                }
                if (activeFilter === "departments" && "name" in item) {
                  return (
                    <div
                      key={(item as Department).id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
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
                if (activeFilter === "doctors" && "specialization" in item) {
                  return (
                    <div
                      key={(item as Doctor).id}
                      className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
                    >
                      <img
                        src={avatar}
                        alt="Doctor"
                        className="w-12 h-12 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(item as Doctor).name}
                      </h3>
                      <p className="mb-1">{(item as Doctor).specialization}</p>

                      <p className="mb-1">
                        {(item as Doctor).department?.name}
                      </p>

                      <p className="mb-1">{(item as Doctor).phone}</p>
                      <p className="mb-1">{(item as Doctor).availableFrom}</p>
                      <p className="mb-1">{(item as Doctor).availableTo}</p>
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
