import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import EditProfileModal from "../../Components/sp/EditProfileModal";
import axios from "axios";
import { changeProfileImage } from "../../api/SP";
import { getProfile, editProfile , getRatingsAndReviews } from "../../api/SP";
import { setCredentials } from "../../redux/slices/spSlice";
import MyMap from "../../Components/common/MapBoxProfile"; 
import EditDepartmentModal from "../../Components/sp/DocumentModal";
import {toast ,Toaster} from 'react-hot-toast'
import RatingsModal from "../../Components/sp/RatingsModal"; 



interface Profile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  district: string;
  city: string;
  pincode: number;
  state: string;
  longitude: number;
  latitude: number;
  isVerified: boolean;
  profileImage: string;
  serviceType: string;
  openingTime: string;
  closingTime: string;
  firstDocumentImage: string;
  secondDocumentImage : string;
}
interface Review {
  doctorName: string;
  patientName: string;
  rating: number;
  review: string;
  createdAt: string;
}


const SPProfile: React.FC = () => {
  const { spInfo } = useSelector((state: RootState) => state.sp);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleDocumentsModal, setHandleDocumentsModal] = useState(false);

  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false); // State to manage Ratings modal
  const [reviews, setReviews] = useState<Review[]>([]); // State to store reviews


  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    area: "",
    district: "",
    city: "",
    pincode: 0,
    state: "",
    longitude: 0,
    latitude: 0,
    isVerified: false,
    profileImage: "",
    serviceType: "Not Selected",
    openingTime: "",
    closingTime: "",
    firstDocumentImage:"",
    secondDocumentImage:""
  });



  // Function to fetch ratings and reviews
  const handleViewRatings = async () => {
    try {
      const response = await getRatingsAndReviews(spInfo._id); // Assuming API exists
      setReviews(response);
      setIsRatingsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch ratings and reviews.");
    }
  };

  const handleRatingsModalClose = () => setIsRatingsModalOpen(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // Send the Cloudinary URL to your backend to save in MongoDB
        const response = await changeProfileImage(spInfo._id, cloudinaryUrl);
        if (response) {
          toast.success("profile Image updated successfully");
        }

        // Update the state with the new image URL
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: cloudinaryUrl,
        }));

        setIsLoading(false); // Stop loading spinner
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image"); // Show error toast
        setIsLoading(false); // Stop loading spinner
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(spInfo._id);
        if (response) {
          setProfile({
            ...response.data,
            serviceType: response.data.serviceType || "Not Selected",
          });
          dispatch(setCredentials(response.data));
        } else {
          console.log("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleEditModalClose = () => setHandleDocumentsModal(false);

  const handleEditDocuments = () => {
    if (spInfo.serviceType === "") {
      toast.error("Select any service type from Edit Profile");
    } else {
      console.log("Opening EditDepartmentModal");
      setHandleDocumentsModal(true);
    }
  };

  

  const handleProfileSave = async (updatedProfile: Profile) => {
    try {
      const response = await editProfile(spInfo._id, updatedProfile);
      if (response) {
        setProfile(updatedProfile);
        dispatch(setCredentials(updatedProfile));
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update the profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster   position="top-center"/>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-semibold mr-2">{profile.name}</h1>
          {profile.isVerified ? (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-blue-500 text-xl"
            />
          ) : (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-red-500 text-xl"
            />
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600  duration-300  hover:scale-105 shadow-md"
          >
            Edit Profile
          </button>
          <button
            onClick={handleEditDocuments}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600  duration-300   hover:scale-105 shadow-md"
          >
            Edit Documents
          </button>
          <button
            onClick={handleViewRatings}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600  duration-300   hover:scale-105 shadow-md"
          >
            View Ratings
          </button>
        </div>

        {isModalOpen && (
          <EditProfileModal
            profile={profile}
            onClose={handleModalClose}
            onSave={handleProfileSave}
          />
        )}
        {isRatingsModalOpen && (
        <RatingsModal
          isOpen={isRatingsModalOpen}
          onClose={handleRatingsModalClose}
          reviews={reviews}
        />
      )}
        {handleDocumentsModal && (
          <EditDepartmentModal
            serviceType={spInfo.serviceType}
            onClose={handleEditModalClose}
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-20">
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-500 text-5xl"
              />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
            <div className="bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center w-32 h-32 rounded-full">
              <label
                htmlFor="profileImageUpload"
                className="text-white cursor-pointer flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit</span>
              </label>
            </div>
            <input
              id="profileImageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-gray-600">Email:</p>
            <p>{profile.email}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Phone:</p>
            <p>{profile.phone}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Area:</p>
            <p>{profile.area}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">District:</p>
            <p>{profile.district}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">City:</p>
            <p>{profile.city}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Pincode:</p>
            <p>{profile.pincode}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">State:</p>
            <p>{profile.state}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Service Type:</p>
            <p>{profile.serviceType}</p>
          </div>
          {/* <div>
            <p className="font-semibold text-gray-600">Opening Time:</p>
            <p>{profile.openingTime}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Closing Time:</p>
            <p>{profile.closingTime}</p>
          </div> */}
          <div>
            <p className="font-semibold text-gray-600">Verified Status:</p>
            <p>{profile.isVerified ? "Verified" : "Not Verified"}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">  
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="relative w-full h-80">
        <MyMap spInfo={spInfo} />
        </div>
      </div>
    </div>
  );
};

export default SPProfile; 
