import React, { useEffect, useState } from "react";
import { isDoctorHaveSlots, deleteDoctor } from "../../api/SP"; // Assuming this is the API call
import Spinner from "../common/RoundSpinner"; // Import the new Spinner component
import { toast ,Toaster} from 'react-hot-toast'; 


interface DeleteDoctorModalProps {
  doctorId: string;
  onClose: () => void;
  onDelete: (doctorId: string) => void; // Add this line

}

const DeleteDoctorModal: React.FC<DeleteDoctorModalProps> = ({
  doctorId,
  onClose,
  onDelete, // Add this line

}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasFutureSlots, setHasFutureSlots] = useState<boolean | null>(null); // State to check for future slots
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorSlots = async () => {
      try {
        setLoading(true);
        const slotsExist = await isDoctorHaveSlots(doctorId); // This should return true or false
        setHasFutureSlots(slotsExist.result);
      } catch (error) {
        console.error("Error fetching doctor slots:", error);
        setError("Failed to check for doctor slots");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorSlots();
  }, [doctorId]);

  const handleDeleteConfirmation = async () => {
    try {
      await deleteDoctor(doctorId);
      toast.success('Doctor deleted successfully.', {
        duration: 1000,
      });
      
      setTimeout(() => {
        onDelete(doctorId); 
        onClose();
      }, 1000);
  
    } catch (error) {
      toast.error('Failed to delete doctor.');
    }
  };
  



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Toaster position="top-center" />
      <div className="bg-white rounded-lg w-96 h-64 p-6 max-h-[90vh] overflow-y-auto"> {/* Adjusted width and height */}
        <h2 className="text-xl font-semibold mb-4">Delete Doctor</h2>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner /> {/* Show spinner while loading */}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>
            {hasFutureSlots
              ? "This doctor has upcoming slots. We will inform patients via email if you proceed with the confirm deletion"
              : "You can safely delete this doctor  if you proceed with the confirm deletion"}
          </p>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
            onClick={handleDeleteConfirmation}
          >
            {hasFutureSlots ? "Confirm Deletion" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDoctorModal;
