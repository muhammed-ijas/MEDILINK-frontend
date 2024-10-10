import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"; // For navigation
import { RootState } from "../../redux/store";
import { addDoctorToDepartment } from "../../api/SP"; // Adjust import path
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faFileAlt } from "@fortawesome/free-solid-svg-icons";

interface DoctorInfo {
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  dateFrom: string;
  dateEnd: string;
  doctorProfileImage: string;
  yearsOfExperience: string;
  validCertificate: string;
}

const SPAddDepartment: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    {
      name: "",
      specialization: "",
      availableFrom: "",
      availableTo: "",
      contact: "",
      dateFrom: "",
      dateEnd: "",
      doctorProfileImage: "",
      yearsOfExperience: "",
      validCertificate: "",
    },
  ]);

  const [errors, setErrors] = useState<{
    doctors: string[];
    noDoctors?: boolean;
  }>({ doctors: [] });

  const navigate = useNavigate();

  const location = useLocation();
  const { departmentId } = location.state || {};

  const { spInfo } = useSelector((state: RootState) => state.sp);

  const handleImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images_preset");
      formData.append("cloud_name", "dhq8p5oyj");

      try {
        setIsLoading(true); // Start loading spinner

        // Upload to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dhq8p5oyj/image/upload",
          formData
        );

        // Cloudinary URL
        const cloudinaryUrl = cloudinaryResponse.data.secure_url;

        // Update the correct doctor's profile image
        setDoctors((prevDoctors) => {
          const updatedDoctors = [...prevDoctors];
          updatedDoctors[index] = {
            ...updatedDoctors[index],
            doctorProfileImage: cloudinaryUrl, // Update the image URL for the correct doctor
          };
          return updatedDoctors;
        });

        setIsLoading(false); // Stop loading spinner
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image"); // Show error toast
        setIsLoading(false); // Stop loading spinner
      }
    }
  };

  const handleValidCertificateImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images_preset");
      formData.append("cloud_name", "dhq8p5oyj");

      try {
        setIsLoading(true); // Start loading spinner

        // Upload to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dhq8p5oyj/image/upload",
          formData
        );

        // Cloudinary URL
        const cloudinaryUrl = cloudinaryResponse.data.secure_url;

        // Update the correct doctor's profile image
        setDoctors((prevDoctors) => {
          const updatedDoctors = [...prevDoctors];
          updatedDoctors[index] = {
            ...updatedDoctors[index],
            validCertificate: cloudinaryUrl, // Update the image URL for the correct doctor
          };
          return updatedDoctors;
        });

        setIsLoading(false); // Stop loading spinner
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image"); // Show error toast
        setIsLoading(false); // Stop loading spinner
      }
    }
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
        doctorProfileImage: "",
        yearsOfExperience: "",
        validCertificate: "",
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
    const newErrors: { doctors: string[] } = {
      doctors: [],
    };
  
    doctors.forEach((doctor, index) => {
      let doctorError = "";
  
      // Name validation: ensure name is not empty and contains only letters
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!doctor.name.trim()) {
        doctorError = "Name is required";
        valid = false;
      } else if (!nameRegex.test(doctor.name.trim())) {
        doctorError = "Name can only contain letters and spaces";
        valid = false;
      }
  
      // Specialization validation: ensure it's not empty
      if (!doctor.specialization.trim()) {
        doctorError = "Specialization is required";
        valid = false;
      }
  
      // Available From and Available To (time) validation
      if (!doctor.availableFrom || !doctor.availableTo) {
        doctorError = "Availability times are required";
        valid = false;
      }
  
      // Contact validation: exactly 10 digits, numbers only
      const contactRegex = /^[0-9]{10}$/;
      if (!doctor.contact.trim()) {
        doctorError = "Contact is required";
        valid = false;
      } else if (!contactRegex.test(doctor.contact.trim())) {
        doctorError = "Contact must be exactly 10 digits and contain only numbers";
        valid = false;
      }
  
      // Date From and Date End validation: end date should be after start date
      const dateFrom = new Date(doctor.dateFrom);
      const dateEnd = new Date(doctor.dateEnd);
  
      if (!doctor.dateFrom || !doctor.dateEnd) {
        doctorError = "Both start and end dates are required";
        valid = false;
      } else if (dateEnd < dateFrom) {
        doctorError = "End date must be after the start date";
        valid = false;
      }
  
      // Profile Image validation: must be uploaded
      if (!doctor.doctorProfileImage) {
        doctorError = "Profile image is required";
        valid = false;
      }
  
      // Years of Experience validation: only digits, between 0 and 100
      const experienceRegex = /^[0-9]+$/;
      if (!doctor.yearsOfExperience.trim()) {
        doctorError = "Years of experience is required";
        valid = false;
      } else if (!experienceRegex.test(doctor.yearsOfExperience)) {
        doctorError = "Years of experience must contain only digits";
        valid = false;
      } else {
        const yearsOfExperience = parseInt(doctor.yearsOfExperience);
        if (yearsOfExperience < 0 || yearsOfExperience > 100) {
          doctorError = "Years of experience must be between 0 and 100";
          valid = false;
        }
      }
  
      // Valid Certificate validation: must be uploaded
      if (!doctor.validCertificate) {
        doctorError = "Valid certificate is required";
        valid = false;
      }
  
      // If any validation failed, add the error to the corresponding doctor
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
      const response = await addDoctorToDepartment(
        spInfo._id,
        departmentId,
        doctors
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
              {/* doctor image upload */}
              <div className="flex flex-col items-center">
                {/* Doctor Image Upload */}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-200">
                      <div
                        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : doctor.doctorProfileImage ? (
                    <img
                      src={doctor.doctorProfileImage}
                      alt="Profile"
                      className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-md border-2 border-gray-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-gray-100 to-gray-300 rounded-full shadow-md border-2 border-gray-300">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-500 text-5xl"
                      />
                    </div>
                  )}

                  {/* Hover effect restricted to the round image area */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                    <div className="bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center">
                      <label
                        htmlFor={`profileImageUpload-${index}`} // Unique ID for each input
                        className="text-white cursor-pointer flex items-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                        <span className="text-sm font-semibold">Edit</span>
                      </label>
                    </div>
                    <input
                      id={`profileImageUpload-${index}`} // Use index here
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)} // Pass index to handleImageChange
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Label for the image upload (centered below the image) */}
                <label
                  htmlFor={`profileImageUpload-${index}`}
                  className="text-lg font-semibold text-gray-700 mt-4 text-center"
                >
                  Add Doctor Image
                </label>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor={`specialization-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Qualification 
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
                  htmlFor={`yearsOfExperience-${index}`}
                  className="text-lg font-semibold text-gray-700"
                >
                  Years Of Experience
                </label>
                <input
                  type="text"
                  id={`yearsOfExperience-${index}`}
                  name="yearsOfExperience"
                  value={doctor.yearsOfExperience}
                  onChange={(e) => handleDoctorChange(index, e)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* validCertificate upload*/}
              <div className="flex flex-col items-center">
                {/* validCertificate upload*/}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-gray-200">
                      <div
                        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded text-blue-600"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : doctor.validCertificate ? (
                    <img
                      src={doctor.validCertificate}
                      alt="validCertificate"
                      className="w-32 h-32 md:w-48 md:h-48 object-cover shadow-md border-2 border-gray-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-gray-100 to-gray-300 shadow-md border-2 border-gray-300">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="text-gray-500 text-5xl"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                      <label
                        htmlFor={`validCertificate-${index}`}
                        className="text-white cursor-pointer flex items-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                        <span className="text-sm font-semibold">Edit</span>
                      </label>
                    </div>
                    <input
                      id={`validCertificate-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleValidCertificateImageChange(index, e)
                      }
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Label for the certificate upload */}
                <label
                  htmlFor={`validCertificate-${index}`}
                  className="text-lg font-semibold text-gray-700 mt-4 text-center"
                >
                  Add Valid Certificate
                </label>
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
