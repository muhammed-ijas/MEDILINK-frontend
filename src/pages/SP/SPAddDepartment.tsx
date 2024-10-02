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

interface DoctorInfo {
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  dateFrom: string;
  dateEnd: string;
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
  },
];

const SPAddDepartment: React.FC = () => {
  const [department, setDepartment] = useState<string>("");
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    {
      name: "",
      specialization: "",
      availableFrom: "",
      availableTo: "",
      contact: "",
      dateFrom: "",
      dateEnd: "",
    },
  ]);
  const [errors, setErrors] = useState<{
    department?: string;
    doctors: string[];
    noDoctors?: boolean; 
  }>({ doctors: [] });

  const [avgTime, setAvgTime] = useState<string>("10"); // Default 10 minutes

  const navigate = useNavigate();
  const { spInfo } = useSelector((state: RootState) => state.sp);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
    setErrors((prev) => ({ ...prev, department: "" }));
  };

  const handleAvgTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvgTime(e.target.value);
    setErrors((prev) => ({ ...prev, avgTime: "" })); // Clear any previous error
  };

  const handleDoctorChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedDoctors = [...doctors];
    updatedDoctors[index][name as keyof DoctorInfo] = value;

    const updatedErrors = [...errors.doctors];
    updatedErrors[index] = "";

    setDoctors(updatedDoctors);
    setErrors((prev) => ({ ...prev, doctors: updatedErrors }));
  };

  const handleAddDoctor = () => {
    setDoctors([
      ...doctors,
      {
        name: "",
        specialization: "",
        availableFrom: "",
        availableTo: "",
        contact: "",
        dateFrom: "",
        dateEnd: "",
      },
    ]);
    setErrors((prev) => ({ ...prev, doctors: [...prev.doctors, ""] }));
  };

  const handleRemoveDoctor = (index: number) => {
    const updatedDoctors = doctors.filter((_, i) => i !== index);
    const updatedErrors = errors.doctors.filter((_, i) => i !== index);

    setDoctors(updatedDoctors);
    setErrors((prev) => ({ ...prev, doctors: updatedErrors }));
  };

  
  const validateForm = () => {
    let valid = true;
    const newErrors: { department?: string; doctors: string[] } = {
      doctors: [],
    };

    // Check if department is selected
    if (!department) {
      newErrors.department = "Department is required";
      valid = false;
    }

    doctors.forEach((doctor, index) => {
      let doctorError = "";

      // Check if all fields are filled
      if (
        !doctor.name.trim() ||
        !doctor.specialization.trim() ||
        !doctor.availableFrom ||
        !doctor.availableTo ||
        !doctor.contact.trim() ||
        !doctor.dateFrom ||
        !doctor.dateEnd
      ) {
        doctorError = "All fields are required for each doctor";
        valid = false;
      }

      // Validate the contact field (only numbers, exactly 10 digits)
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(doctor.contact.trim())) {
        doctorError =
          "Contact must be exactly 10 digits and contain only numbers";
        valid = false;
      }

      // Validate dateFrom and dateEnd
      const dateFrom = new Date(doctor.dateFrom);
      const dateEnd = new Date(doctor.dateEnd);

      if (dateEnd < dateFrom) {
        doctorError = "End date must be after the start date";
        valid = false;
      }

      if (doctorError) {
        newErrors.doctors[index] = doctorError;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    let hasErrors = false;
    const newErrors = {
      department: "",
      doctors: [],
      avgTime: "",
      noDoctors: false,
    };

    // Check if department is selected
    if (!department) {
      newErrors.department = "Please select a department.";
      hasErrors = true;
    }

    // Check if at least one doctor is added
    if (doctors.length === 0) {
      newErrors.noDoctors = true;
      hasErrors = true;
    }

    // If there are any errors, set them and stop the save
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    if (!validateForm()) return;

    try {
      const response = await addDepartment(
        spInfo._id,
        department,
        doctors,
        avgTime
      );
      if (response) {
        toast.success("Department updated successfully!", {
          duration: 1000,
        });
        setTimeout(() => {
          navigate("/sp/viewDetaildServices");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleClose = () => {
    navigate("/sp/viewDetaildServices"); // Navigate back or close the modal
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
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
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
            <option value="10">10 minutes (default)</option>{" "}
            {/* Default option */}
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
        <h2 className="text-xl font-semibold mb-4">Add Doctors</h2>
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded-lg mb-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor={`name-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
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
                <label
                  htmlFor={`specialization-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
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
                <label
                  htmlFor={`availableFrom-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Available From (Time)
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
                <label
                  htmlFor={`availableTo-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Available To (Time)
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
                <label
                  htmlFor={`dateFrom-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Available From (Date)
                </label>
                <input
                  type="date"
                  id={`dateFrom-${index}`}
                  name="dateFrom"
                  value={doctor.dateFrom}
                  onChange={(e) => handleDoctorChange(index, e)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor={`dateEnd-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Available To (Date)
                </label>
                <input
                  type="date"
                  id={`dateEnd-${index}`}
                  name="dateEnd"
                  value={doctor.dateEnd}
                  onChange={(e) => handleDoctorChange(index, e)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor={`contact-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Contact
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
              {errors.doctors[index] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.doctors[index]}
                </p>
              )}
            </div>
            {/* Show the Remove button only if there are more than one doctor */}
            {doctors.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveDoctor(index)}
                className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Remove Doctor
              </button>
            )}
          </div>
        ))}

        {errors.noDoctors && (
          <p className="text-red-500 text-sm mt-1">
            You must add at least one doctor before saving the department.
          </p>
        )}
        {/* Add Doctor Button */}
        <button
          type="button"
          onClick={handleAddDoctor}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Add Doctor
        </button>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default SPAddDepartment;
