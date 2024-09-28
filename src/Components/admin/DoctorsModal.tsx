import React from "react";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  contact: string;
  availableFrom: string;
  availableTo: string;
}

interface DoctorsModalProps {
  doctors: Doctor[];
  isOpen: boolean;
  onClose: () => void;
}

const DoctorsModal: React.FC<DoctorsModalProps> = ({
  doctors,
  isOpen,
  onClose,
}) => {
  if (!isOpen || doctors.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70  ">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl  max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Doctors
        </h2>
        <ul className="space-y-4">
          {doctors.map((doctor) => (
            <li
              key={doctor._id}
              className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200 text-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {doctor.name}
              </h3>
              <p>
                <strong className="font-medium text-gray-700">
                  Specialization:
                </strong>{" "}
                {doctor.specialization}
              </p>
              <p>
                <strong className="font-medium text-gray-700">Phone:</strong>{" "}
                {doctor.contact}
              </p>
              <p>
                <strong className="font-medium text-gray-700">Available From:</strong>{" "}
                {doctor.availableFrom}
              </p>
              <p>
                <strong className="font-medium text-gray-700">To:</strong>{" "}
                {doctor.availableTo}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsModal;