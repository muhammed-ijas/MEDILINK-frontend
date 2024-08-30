import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For navigation
import { RootState } from "../../redux/store";
import { addDepartment } from '../../api/SP'; // Adjust import path
import { toast } from 'react-toastify'; // For notifications

interface DepartmentOption {
  value: string;
  label: string;
  description: string;
}

interface DoctorInfo {
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
}


const departmentOptions: DepartmentOption[] = [
  { value: 'emergency', label: 'Emergency Department (ED)', description: 'Immediate care for acute illnesses and injuries' },
  { value: 'cardiology', label: 'Cardiology', description: 'Diagnosis and treatment of heart and vascular conditions' },
  { value: 'neurology', label: 'Neurology', description: 'Care for brain, spinal cord, and nervous system disorders' },
  { value: 'pediatrics', label: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
  { value: 'obstetrics', label: 'Obstetrics and Gynecology', description: 'Women’s reproductive health and childbirth' },
  { value: 'oncology', label: 'Oncology', description: 'Diagnosis and treatment of cancer' },
  { value: 'orthopedics', label: 'Orthopedics', description: 'Treatment of musculoskeletal system issues' },
  { value: 'radiology', label: 'Radiology', description: 'Imaging services for diagnosis and treatment' },
  { value: 'pathology', label: 'Pathology', description: 'Laboratory analysis of body tissues and fluids' },
  { value: 'surgery', label: 'General Surgery', description: 'Surgical procedures for a wide range of conditions' },
  { value: 'urology', label: 'Urology', description: 'Treatment of urinary and male reproductive systems' },
  { value: 'dermatology', label: 'Dermatology', description: 'Care for skin, hair, and nail conditions' },
  { value: 'gastroenterology', label: 'Gastroenterology', description: 'Treatment of digestive system disorders' },
  { value: 'nephrology', label: 'Nephrology', description: 'Care for kidney-related conditions' },
  { value: 'pulmonology', label: 'Pulmonology', description: 'Treatment of lung and respiratory tract disorders' },
  { value: 'psychiatry', label: 'Psychiatry', description: 'Mental health care and treatment' },
  { value: 'endocrinology', label: 'Endocrinology', description: 'Treatment of hormonal and metabolic disorders' },
  { value: 'rheumatology', label: 'Rheumatology', description: 'Care for autoimmune and inflammatory diseases' },
  { value: 'anesthesiology', label: 'Anesthesiology', description: 'Pain management and anesthesia for surgeries' },
  { value: 'icu', label: 'Intensive Care Unit (ICU)', description: 'Critical care for severely ill or injured patients' },
  { value: 'infectious-diseases', label: 'Infectious Diseases', description: 'Treatment of infections and contagious diseases' },
  { value: 'ophthalmology', label: 'Ophthalmology', description: 'Eye care and vision services' },
  { value: 'ent', label: 'ENT (Otorhinolaryngology)', description: 'Care for ear, nose, and throat conditions' },
  { value: 'hematology', label: 'Hematology', description: 'Treatment of blood disorders' },
  { value: 'physical-medicine', label: 'Physical Medicine and Rehab', description: 'Rehabilitation and physical therapy services' },
];

const SPAddDepartment: React.FC = () => {
  const [department, setDepartment] = useState<string>('');
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    { name: '', specialization: '', availableFrom: '', availableTo: '', contact: '' },
  ]);

  const navigate = useNavigate()
  const { spInfo } = useSelector((state: RootState) => state.sp);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
  };

  const handleDoctorChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDoctors = [...doctors];
    updatedDoctors[index][name as keyof DoctorInfo] = value;
    setDoctors(updatedDoctors);
  };

  const handleAddDoctor = () => {
    setDoctors([...doctors, { name: '', specialization: '', availableFrom: '', availableTo: '', contact: '' }]);
  };

  const handleSave = async () => {
    try {
      if (!department || doctors.length === 0) {
        // Add some validation if needed
        console.error('Department or doctors information is missing');
        return;
      }
  
      const response = await addDepartment(spInfo._id, department, doctors);
      if (response) {
        toast.success('Successfully added');
        navigate('/sp/services');
      }
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-950 mb-6">Add Department</h1>
        <div className="mb-6">
          <label htmlFor="department" className="block text-lg font-semibold text-gray-700 mb-2">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={department}
            onChange={handleDepartmentChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="" disabled>Select Department</option>
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Doctors</h2>
          {doctors.map((doctor, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label htmlFor={`name-${index}`} className="text-lg font-semibold text-gray-700">
                    Doctor's Name
                  </label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    name="name"
                    value={doctor.name}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`specialization-${index}`} className="text-lg font-semibold text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    id={`specialization-${index}`}
                    name="specialization"
                    value={doctor.specialization}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`availableFrom-${index}`} className="text-lg font-semibold text-gray-700">
                    Available From
                  </label>
                  <input
                    type="time"
                    id={`availableFrom-${index}`}
                    name="availableFrom"
                    value={doctor.availableFrom}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`availableTo-${index}`} className="text-lg font-semibold text-gray-700">
                    Available To
                  </label>
                  <input
                    type="time"
                    id={`availableTo-${index}`}
                    name="availableTo"
                    value={doctor.availableTo}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`contact-${index}`} className="text-lg font-semibold text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id={`contact-${index}`}
                    name="contact"
                    value={doctor.contact}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  onClick={() => setDoctors(doctors.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Doctor
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddDoctor}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add Another Doctor
          </button>
        </div>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Save Department
        </button>
      </section>
    </div>
  );
};

export default SPAddDepartment;