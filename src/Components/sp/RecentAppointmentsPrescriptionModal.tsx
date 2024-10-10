interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    prescription: Medication[];
  }
  
  export interface Medication {
    medication: string;
    dosage: string;
    frequency: string;
    route: string;
    duration: string;
    instructions: string;
    refills?: number;
  }
  
  const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
    isOpen,
    onClose,
    prescription,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Prescription Details</h3>
  
          {prescription.length > 0 ? (
            <ul className="space-y-4">
              {prescription.map((med, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="text-gray-700">
                      <label className="font-semibold">Medication:</label> {med.medication}
                    </div>
                    <div className="text-gray-700">
                      <label className="font-semibold">Dosage:</label> {med.dosage}
                    </div>
                    <div className="text-gray-700">
                      <label className="font-semibold">Frequency:</label> {med.frequency}
                    </div>
                    <div className="text-gray-700">
                      <label className="font-semibold">Route:</label> {med.route}
                    </div>
                    <div className="text-gray-700">
                      <label className="font-semibold">Duration:</label> {med.duration}
                    </div>
                    <div className="text-gray-700">
                      <label className="font-semibold">Instructions:</label> {med.instructions}
                    </div>
                    {med.refills && (
                      <div className="text-gray-700">
                        <label className="font-semibold">Refills:</label> {med.refills}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No prescription available.</p>
            </div>
          )}
  
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
  
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default PrescriptionModal;
  