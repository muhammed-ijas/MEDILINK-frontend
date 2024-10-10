// components/PrescriptionModal.tsx

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { addPrescriptionToAppointment, Medication, Prescription, getPrescription } from '../../api/SP'; // Import the necessary types and functions
import Spinner from '../common/Spinner';

interface PrescriptionModalProps {
  isOpen: boolean;
  closePrescriptionModal: () => void;
  appointment: {
    _id: string;
    patientName: string;
  };
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ isOpen, closePrescriptionModal, appointment }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
      setLoading(true); // Set loading true before fetching

      try {
        const existingPrescription = await getPrescription(appointment._id);
        console.log("existingPrescription: ", existingPrescription);
        if (existingPrescription && existingPrescription.length > 0) {
          console.log("came inside if");
          setMedications(existingPrescription); // Set all fetched medications
          console.log("Setting medications to: ", existingPrescription);
        }
      } catch (err) {
        console.error('Error fetching prescription:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (isOpen) {
      fetchPrescription();
    }
  }, [isOpen, appointment._id]);


  // Function to handle changes to medication fields
  const handleMedicationChange = (index: number, field: keyof Medication, value: string | number) => {
    const updatedMedications = [...medications];
    
    if (field === 'refills') {
      updatedMedications[index][field] = value as number; // Cast to number when field is 'refills'
    } else {
      updatedMedications[index][field] = value as string; // Default to string for other fields
    }
    
    setMedications(updatedMedications);
  };

  // Function to add a new medication input
  const addMedicationInput = () => {
    setMedications([
      ...medications,
      {
        medication: '',
        dosage: '',
        frequency: '',
        route: '',
        duration: '',
        instructions: '',
        refills: 0,
      },
    ]);
  };

  // Function to remove a medication input
  const removeMedicationInput = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  // Function to handle prescription submission
  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const prescription: Prescription = { medications }; // Create a Prescription object

    try {
      await addPrescriptionToAppointment(appointment._id, prescription);
      toast.success('Prescription saved successfully');
      setTimeout(() => {
        closePrescriptionModal();
      }, 1500);
    } catch (err) {
      console.error('Error saving prescription:', err);
      setError('Failed to save prescription. Please try again.');
      toast.error('Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md overflow-auto" style={{ maxHeight: '80vh' }}>
        <h2 className="text-2xl font-bold mb-4">Add Prescription for {appointment.patientName}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <Spinner /> // Show spinner while loading
        ) : (
          <form onSubmit={handlePrescriptionSubmit}>
            {Array.isArray(medications) && medications.length > 0 && medications.map((medication, index) => (
  <div key={index} className="mb-4 border p-4 rounded shadow-md bg-gray-50">
    <h3 className="font-semibold mb-2 text-lg">Medication {index + 1}</h3>
    
    <label className="block mb-1 font-medium text-gray-700">Medication</label>
    <input
      type="text"
      value={medication.medication}
      onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)}
      placeholder="Medication"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    
    <label className="block mb-1 font-medium text-gray-700">Dosage</label>
    <input
      type="text"
      value={medication.dosage}
      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
      placeholder="Dosage"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    
    <label className="block mb-1 font-medium text-gray-700">Frequency</label>
    <input
      type="text"
      value={medication.frequency}
      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
      placeholder="Frequency"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    
    <label className="block mb-1 font-medium text-gray-700">Route</label>
    <input
      type="text"
      value={medication.route}
      onChange={(e) => handleMedicationChange(index, 'route', e.target.value)}
      placeholder="Route"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    
    <label className="block mb-1 font-medium text-gray-700">Duration</label>
    <input
      type="text"
      value={medication.duration}
      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
      placeholder="Duration"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    
    <label className="block mb-1 font-medium text-gray-700">Instructions</label>
    <textarea
      value={medication.instructions}
      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
      placeholder="Instructions"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      rows={2}
    />
    
    <label className="block mb-1 font-medium text-gray-700">Refills</label>
    <input
      type="number"
      value={medication.refills}
      onChange={(e) => handleMedicationChange(index, 'refills', Number(e.target.value))}
      placeholder="Refills"
      className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      min={0}
    />
    
    <button
      type="button"
      onClick={() => removeMedicationInput(index)}
      className="px-2 py-1 bg-red-500 text-white rounded mt-2 hover:bg-red-600 transition duration-200"
    >
      Remove
    </button>
  </div>
))}

            <button
              type="button"
              onClick={addMedicationInput}
              className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
              Add Medication
            </button>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closePrescriptionModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Prescription'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
