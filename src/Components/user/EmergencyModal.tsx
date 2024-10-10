import  { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { getEmergencyNumbers } from "../../api/user";
import LoadingSpinner from "../common/RoundSpinner";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [emergencyNumbers, setEmergencyNumbers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchEmergencyNumbers = async () => {
        try {
          setLoading(true);
          const response = await getEmergencyNumbers();
          console.log("response from backend :", response);
          setEmergencyNumbers(response);
        } catch (err) {
          setError("Failed to load emergency numbers.");
        } finally {
          setLoading(false);
        }
      };

      fetchEmergencyNumbers();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-100 animate-modal-enter">
        <h2 className="text-xl font-semibold mb-4">Emergency Services</h2>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* No Results State */}
        {!loading && emergencyNumbers.length === 0 && (
          <div className="flex flex-col items-center">
            <FaExclamationTriangle className="text-red-500 text-3xl mb-2" />
            <p className="text-gray-700">No emergency numbers available.</p>
          </div>
        )}
        
        {/* Emergency Numbers List */}
        {!loading && emergencyNumbers.length > 0 && (
          <ul className="list-disc pl-4 space-y-2">
            {emergencyNumbers.map((number, index) => (
              <li key={index} className="text-gray-800">
                {number?.emergencyNumber}: {number?.serviceProvider?.name}
              </li>
            ))}
          </ul>
        )}

        {/* Close Button */}
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmergencyModal;
