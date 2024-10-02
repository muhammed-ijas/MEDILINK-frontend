import React, { useState, useEffect } from "react";
import { getEmergencyNumber, updateEmergencyNumber, deleteEmergencyNumber } from "../../api/SP";
import { FaTrashAlt } from "react-icons/fa"; // For delete icon
import {toast,Toaster} from "react-hot-toast"

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  spId: string;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, spId }) => {
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && spId) {
      fetchEmergencyNumber();
    }
  }, [isOpen, spId]);

  const fetchEmergencyNumber = async () => {
    try {
      const response = await getEmergencyNumber(spId);
      console.log("Fetched emergency number:", response?.data[0].emergencyNumber);
      if (response &&response.data &&  response.data[0].emergencyNumber) {
        const emergencyData = response.data[0];
        setEmergencyNumber(emergencyData.emergencyNumber || "");
        setIsEditing(!!emergencyData.emergencyNumber); 
      } else {
        setEmergencyNumber("");
        setIsEditing(false); // Set to false if no emergency number exists
      }
    } catch (error) {
      console.error("Error fetching emergency number:", error);
    }
  };

  const handleSave = async () => {
    try {
      await updateEmergencyNumber(spId, emergencyNumber);
      setIsEditing(true); 
      toast.success("succesfully updated")
    } catch (error) {
      console.error("Error saving emergency number:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmergencyNumber(spId);
      setEmergencyNumber("");
      setIsEditing(false); // Set editing to false after deletion
      toast.success("successfully deleted")
    } catch (error) {
      console.error("Error deleting emergency number:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Toaster   position="top-center" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Update Emergency Number" : "Add Emergency Number"}
        </h2>

        <div className="space-y-4">
          {/* Emergency Number Input */}
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter Emergency Number"
            value={emergencyNumber}
            onChange={(e) => setEmergencyNumber(e.target.value)}
          />

          {/* Save or Update Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            onClick={handleSave}
          >
            {isEditing ? "Update" : "Add"}
          </button>

          {/* Delete Button if number exists */}
          {isEditing && (
            <button
              className="flex items-center justify-center text-red-500 hover:text-red-700"
              onClick={handleDelete}
            >
              <FaTrashAlt className="mr-2" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
