import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { getDoctorDetails, updateDoctorDetails } from '../../api/SP'; // Update with your actual API service path
import axios from 'axios';
import { toast ,Toaster} from 'react-hot-toast'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUser,faFileAlt } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../Components/common/LoadingSpinner';

interface DoctorDetails {
  _id: string;
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  doctorProfileImage: string;
  yearsOfExperience: string;
  validCertificate: string;
}

const EditDoctorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { doctorId,department } = location.state; // Get doctorId from state
  const [_doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editableFields, setEditableFields] = useState({
    name: '',
    specialization: '',
    yearsOfExperience: '',
    contact: '',
    doctorProfileImage: '',
    validCertificate: ''
  });

  const [isImageLoading] = useState(false); 


  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await getDoctorDetails(doctorId);
        setDoctorDetails(response);
        setEditableFields({
          name: response.name,
          specialization: response.specialization,
          yearsOfExperience: response.yearsOfExperience,
          contact: response.contact,
          doctorProfileImage: response.doctorProfileImage,
          validCertificate: response.validCertificate
        });
      } catch (error) {
        setError('Failed to fetch doctor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Cloudinary upload function for images
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");
    formData.append("cloud_name", "dhq8p5oyj");

    try {
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dhq8p5oyj/image/upload",
        formData
      );
      toast.success("image successfully uploaded")
      return cloudinaryResponse.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error; // Propagate the error
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setEditableFields(prevState => ({
          ...prevState,
          [field]: imageUrl // Update the field with the new image URL
        }));
      } catch (error) {
        setError('Image upload failed.');
      }
    }
  };


  const handleSave = async () => {
    try {
      await updateDoctorDetails(doctorId, editableFields);
      toast.success('Doctor details updated successfully.',{
        duration: 1000,
      });
      setTimeout(() => {
        navigate("/sp/viewSingleDepartmentDetails", {
          state: { 
            department: {
              ...department, 
              doctors: department.doctors.map((doctor: DoctorDetails) => 
                doctor._id === doctorId ? { ...doctor, ...editableFields } : doctor
              ) 
            }
          },
        });}, 1000);
      
    } catch (error) {
      setError('Failed to update doctor details.');
    }
  };

  

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Doctor Details</h1>
  
      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={editableFields.name}
            onChange={handleChange}
            className="border-gray-300 border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
  
        {/* Qualification Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Qualification</label>
          <input
            type="text"
            name="specialization"
            value={editableFields.specialization}
            onChange={handleChange}
            className="border-gray-300 border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
  
        {/* Experience Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Years of Experience</label>
          <input
            type="text"
            name="yearsOfExperience"
            value={editableFields.yearsOfExperience}
            onChange={handleChange}
            className="border-gray-300 border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
  
        {/* Contact Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Contact</label>
          <input
            type="text"
            name="contact"
            value={editableFields.contact}
            onChange={handleChange}
            className="border-gray-300 border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
  
        {/* Doctor Image Upload */}
        <div className="mb-8">
          <div className="relative flex-shrink-0 flex items-center justify-center">
            {isImageLoading ? (
              <div className="flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-200">
                <div
                  className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-t-blue-600"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : editableFields.doctorProfileImage ? (
              <img
                src={editableFields.doctorProfileImage}
                alt="Profile"
                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-md border-2 border-gray-300"
              />
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 bg-gradient-to-tr from-gray-100 to-gray-300 rounded-full flex items-center justify-center shadow-md border-2 border-gray-300">
                <FontAwesomeIcon icon={faUser} className="text-gray-500 text-5xl" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
              <div className="bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center">
                <label className="text-white cursor-pointer flex items-center space-x-2">
                  <FontAwesomeIcon icon={faEdit} className="text-xl" />
                  <span className="text-sm font-semibold">Edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'doctorProfileImage')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          <p className="text-center text-lg font-semibold text-gray-700 mt-4">Add Doctor Image</p>
        </div>
  
        {/* Valid Certificate Upload */}
        <div className="mb-8">
          <div className="relative flex-shrink-0 flex items-center justify-center">
            {isImageLoading ? (
              <div className="flex items-center justify-center w-40 h-40 md:w-48 md:h-48 bg-gray-200">
                <div
                  className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-t-blue-600"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : editableFields.validCertificate ? (
              <img
                src={editableFields.validCertificate}
                alt="Valid Certificate"
                className="w-40 h-40 md:w-48 md:h-48 object-cover shadow-md border-2 border-gray-300"
              />
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 bg-gradient-to-tr from-gray-100 to-gray-300 rounded-md flex items-center justify-center shadow-md border-2 border-gray-300">
                <FontAwesomeIcon icon={faFileAlt} className="text-gray-500 text-5xl" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-md overflow-hidden">
              <div className="bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 w-40 h-40 md:w-48 md:h-48 rounded-md flex items-center justify-center">
                <label className="text-white cursor-pointer flex items-center space-x-2">
                  <FontAwesomeIcon icon={faEdit} className="text-xl" />
                  <span className="text-sm font-semibold">Edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'validCertificate')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          <p className="text-center text-lg font-semibold text-gray-700 mt-4">Add Certificate</p>
        </div>
  
        <button
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
  
};

export default EditDoctorPage;
