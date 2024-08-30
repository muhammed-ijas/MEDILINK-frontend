import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import homenurseImage from "../../../public/logo/HomePage/homenurseImage.png";
import { faBuilding } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import {
  getDepartments,
  getDoctors,
  getServiceProviders,
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

interface ServiceProvider {
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
    "departments" | "doctors" | "providers"
  >("departments");
  const [data, setData] = useState<Department[] | Doctor[] | ServiceProvider[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchData = async () => {
    let result:
      | ApiResult<Department>
      | ApiResult<Doctor>
      | ApiResult<ServiceProvider>;
    switch (activeFilter) {
      case "departments":
        result = await getDepartments(currentPage, ITEMS_PER_PAGE);
        console.log("departments : ", result);
        break;
      case "doctors":
        result = await getDoctors(currentPage, ITEMS_PER_PAGE);
        console.log("doctors : ", result);

        break;
      case "providers":
        result = await getServiceProviders(currentPage, ITEMS_PER_PAGE);
        console.log("providers : ", result);

        break;
      default:
        result = { items: [], totalPages: 1 }; // Default value
    }
    setData(result.items);
    setTotalPages(result.totalPages);
  };

  useEffect(() => {
    fetchData();
  }, [activeFilter, currentPage]);

  const handleFilterChange = (
    filter: "departments" | "doctors" | "providers"
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
            <input
              type="text"
              placeholder="Search for departments, doctors, hospitals, clinics..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-5 h-5 text-gray-500" />
            </span>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            <button
              className={`bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg transition ${
                activeFilter === "departments"
                  ? "bg-blue-600"
                  : "hover:bg-blue-600"
              }`}
              onClick={() => handleFilterChange("departments")}
            >
              Departments
            </button>
            <button
              className={`bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg transition ${
                activeFilter === "doctors" ? "bg-blue-600" : "hover:bg-blue-600"
              }`}
              onClick={() => handleFilterChange("doctors")}
            >
              Doctors
            </button>
            <button
              className={`bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg transition ${
                activeFilter === "providers"
                  ? "bg-blue-600"
                  : "hover:bg-blue-600"
              }`}
              onClick={() => handleFilterChange("providers")}
            >
              Providers
            </button>
          </div>
        </motion.div>
      </section>

      {/* Results Section */}
      <section className=" mt-11 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map((item: Department | Doctor | ServiceProvider) => {
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
                    <p className="mb-1">{(item as Doctor).department.name}</p>
                    <p className="mb-1">{(item as Doctor).phone}</p>
                    <p className="mb-1">{(item as Doctor).availableFrom}</p>
                    <p className="mb-1">{(item as Doctor).availableTo}</p>
                  </div>
                );
              }
              if (activeFilter === "providers") {
                return (
                  <div
                    key={(item as ServiceProvider).id}
                    className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
                  >
                    <img
                      src={(item as ServiceProvider).profileImage}
                      alt="Provider"
                      className="w-12 h-12 rounded-full mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">
                      {(item as ServiceProvider).name}
                    </h3>
                    <p className="mb-1">
                      {(item as ServiceProvider).area},{" "}
                      {(item as ServiceProvider).city},{" "}
                      {(item as ServiceProvider).district}
                    </p>
                    <p>{(item as ServiceProvider).phone}</p>
                  </div>
                );
              }
              return null;
            })
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
