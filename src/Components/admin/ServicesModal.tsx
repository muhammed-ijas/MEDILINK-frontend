import React, { useState } from "react";
import DoctorsModal from "./DoctorsModal"; // Import the DoctorsModal component

interface Department {
  _id: string;
  name: string;
  doctors: Doctor[];
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
}

interface ServiceProvider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  district: string;
  state: string;
  profileImage: string;
  isVerified: boolean;
  pincode: number;
  isBlocked: boolean;
  serviceType: string;
  departments: Department[]; // Add departments field to the ServiceProvider interface
}

interface ServiceProviderModalProps {
  provider: ServiceProvider | null;
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
}

const ServicesModal: React.FC<ServiceProviderModalProps> = ({ provider, isOpen, onClose, onBlock }) => {
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);
  const [isDoctorsModalOpen, setIsDoctorsModalOpen] = useState<boolean>(false);

  const handleDepartmentClick = (doctors: Doctor[]) => {
    setSelectedDoctors(doctors);
    setIsDoctorsModalOpen(true);
  };

  const closeDoctorsModal = () => {
    setIsDoctorsModalOpen(false);
    setSelectedDoctors([]);
  };

  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <img
            src={provider.profileImage}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-lg"
          />
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{provider.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-left text-gray-700">
            <p><strong>Phone:</strong> {provider.phone}</p>
            <p><strong>Area:</strong> {provider.area}</p>
            <p><strong>District:</strong> {provider.district}</p>
            <p><strong>State:</strong> {provider.state}</p>
            <p><strong>Pincode:</strong> {provider.pincode}</p>
            <p><strong>Is Blocked:</strong> {provider.isBlocked ? "true" : "false"}</p>
            <p><strong>Service Type:</strong> {provider.serviceType}</p>
            <p className="col-span-2"><strong>Email:</strong> {provider.email}</p>
          </div>
        </div>
        {provider.departments && provider.departments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Departments</h3>
            <div className="flex flex-wrap gap-2">
              {provider.departments.map((department) => (
                <button
                  key={department._id}
                  onClick={() => handleDepartmentClick(department.doctors)}
                  className="bg-black text-white py-2 px-4 rounded hover:bg-gray-950"
                >
                  {department.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onBlock}
            className="w-full py-2 px-4 hover:bg-red-500 text-white rounded-full bg-red-600 transition-colors duration-300 mr-4"
          >
            Block
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4  text-white  hover:bg-blue-800 bg-blue-900  rounded-full transition-colors duration-300 "
          >
            Close
          </button>
        </div>
      </div>

      {/* Render the DoctorsModal */}
      <DoctorsModal
        doctors={selectedDoctors}
        isOpen={isDoctorsModalOpen}
        onClose={closeDoctorsModal}
      />
    </div>
  );
};

export default ServicesModal;
