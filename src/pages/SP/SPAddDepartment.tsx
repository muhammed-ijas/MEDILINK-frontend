import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // For navigation
import { RootState } from "../../redux/store";
import { addDepartment } from "../../api/SP"; // Adjust import path
import { toast, Toaster } from "react-hot-toast";

interface DepartmentOption {
  value: string;
  label: string;
  description: string;
}

const departmentOptions: DepartmentOption[] = [
  {
    value: "emergency",
    label: "Emergency Department (ED)",
    description: "Immediate care for acute illnesses and injuries",
  },
  {
    value: "cardiology",
    label: "Cardiology",
    description: "Diagnosis and treatment of heart and vascular conditions",
  },
  {
    value: "neurology",
    label: "Neurology",
    description: "Care for brain, spinal cord, and nervous system disorders",
  },
  {
    value: "pediatrics",
    label: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
  },
  {
    value: "obstetrics",
    label: "Obstetrics and Gynecology",
    description: "Women’s reproductive health and childbirth",
  },
  {
    value: "oncology",
    label: "Oncology",
    description: "Diagnosis and treatment of cancer",
  },
  {
    value: "orthopedics",
    label: "Orthopedics",
    description: "Treatment of musculoskeletal system issues",
  },
  {
    value: "radiology",
    label: "Radiology",
    description: "Imaging services for diagnosis and treatment",
  },
  {
    value: "pathology",
    label: "Pathology",
    description: "Laboratory analysis of body tissues and fluids",
  },
  {
    value: "surgery",
    label: "General Surgery",
    description: "Surgical procedures for a wide range of conditions",
  },
  {
    value: "urology",
    label: "Urology",
    description: "Treatment of urinary and male reproductive systems",
  },
  {
    value: "dermatology",
    label: "Dermatology",
    description: "Care for skin, hair, and nail conditions",
  },
  {
    value: "gastroenterology",
    label: "Gastroenterology",
    description: "Treatment of digestive system disorders",
  },
  {
    value: "nephrology",
    label: "Nephrology",
    description: "Care for kidney-related conditions",
  },
  {
    value: "pulmonology",
    label: "Pulmonology",
    description: "Treatment of lung and respiratory tract disorders",
  },
  {
    value: "psychiatry",
    label: "Psychiatry",
    description: "Mental health care and treatment",
  },
  {
    value: "endocrinology",
    label: "Endocrinology",
    description: "Treatment of hormonal and metabolic disorders",
  },
  {
    value: "rheumatology",
    label: "Rheumatology",
    description: "Care for autoimmune and inflammatory diseases",
  },
  {
    value: "anesthesiology",
    label: "Anesthesiology",
    description: "Pain management and anesthesia for surgeries",
  },
  {
    value: "icu",
    label: "Intensive Care Unit (ICU)",
    description: "Critical care for severely ill or injured patients",
  },
  {
    value: "infectious-diseases",
    label: "Infectious Diseases",
    description: "Treatment of infections and contagious diseases",
  },
  {
    value: "ophthalmology",
    label: "Ophthalmology",
    description: "Eye care and vision services",
  },
  {
    value: "ent",
    label: "ENT (Otorhinolaryngology)",
    description: "Care for ear, nose, and throat conditions",
  },
  {
    value: "hematology",
    label: "Hematology",
    description: "Treatment of blood disorders",
  },
  {
    value: "physical-medicine",
    label: "Physical Medicine and Rehab",
    description: "Rehabilitation and physical therapy services",
  },];

const SPAddDepartment: React.FC = () => {
  const [department, setDepartment] = useState<string>("");
  const [avgTime, setAvgTime] = useState<string>("10"); // Default 10 minutes
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { spInfo } = useSelector((state: RootState) => state.sp);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
  };

  const handleAvgTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvgTime(e.target.value);
  };

  const handleSave = async () => {
    if (!department) {
      toast.error("Please select a department before saving.", {
        duration: 1500,
      });
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Assuming addDepartment returns a proper response object or throws an error
      const response = await addDepartment(spInfo._id, department, avgTime);
  
      // Check if response exists before checking the status
      if (response && response.status === 201) {
        toast.error("Department already added!", {
          duration: 1000,
        });
      } else if (response) {
        // Assuming success if response exists and status is not 201
        toast.success("Department added successfully!", {
          duration: 1000,
        });
        setTimeout(() => {
          navigate("/sp/viewDetaildServices");
        }, 1000);
      } else {
        // In case response is void or undefined
        toast.error("Failed to add department. Please try again.", {
          duration: 1500,
        });
      }
  
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Failed to add department. Please try again.", {
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleClose = () => {
    navigate("/sp/viewDetaildServices"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <Toaster position="top-center" />
      <section className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold text-blue-950 mb-6">
          Add Department
        </h1>

        <div className="mb-6">
          <label
            htmlFor="department"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Department
          </label>
          <select
            id="department"
            name="department"
            value={department}
            onChange={handleDepartmentChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="" disabled>
              Select Department
            </option>
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="avgTime"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Average Time For One Patient
          </label>
          <select
            id="avgTime"
            name="avgTime"
            value={avgTime}
            onChange={handleAvgTimeChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="10">10 minutes (default)</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SPAddDepartment;
