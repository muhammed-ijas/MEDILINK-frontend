import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHospitalClinicDetails } from "../../api/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "react-hot-toast";
import MyMap from "../../Components/common/MapBoxProfile";
import LoadingSpinner from "../../Components/common/LoadingSpinner";

// Types for departments and service providers
interface Department {
  _id: string;
  name: string;
  doctors: string[];
}

interface ServiceProvider {
  _id: string;
  name: string;
  area: string;
  city: string;
  district: string;
  state: string;
  phone: string;
  pincode: string;
  isBlocked: boolean;
  serviceType: string;
  email: string;
  profileImage?: string;
  firstDocumentImage?: string;
  secondDocumentImage?: string;
  departments: Department[];
  isVerified: boolean;
  latitude: number;
  longitude: number;
}

const HospitalClinicDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading , setIsLoading]=useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getDetails = async () => {
      try {
        setIsLoading(true)
        const response = await getHospitalClinicDetails(id);
        setProvider(response);
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch service provider details");
        toast.error("Failed to fetch service provider details.");
      } finally {
        // setLoading(false);
      }
    };

    getDetails();
  }, [id]);



  const handleDepartment = (id:string) => {
      console.log("id :     : ",id)
      navigate(`/user/departmentDetailedPage/${id}`);
  };


  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  const spInfo =
    provider?.latitude && provider?.longitude
      ? { latitude: provider.latitude, longitude: provider.longitude }
      : null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Toaster position="top-center" />

      {/* Provider Name */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold inline-block">
          {provider?.name}
        </h1>
        {provider?.isVerified && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-blue-500 text-xl ml-2"
          />
        )}
      </div>

      {/* Profile Image and Information */}
      <div className="flex flex-col items-center md:flex-row gap-12 justify-center">
        {" "}
        {/* Centering the layout */}
        {/* Profile Image */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {provider?.profileImage ? (
            <img
              src={provider.profileImage}
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
        </div>
        {/* Provider Information */}
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-gray-600">Email:</p>
            <p>{provider?.email}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Phone:</p>
            <p>{provider?.phone}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Area:</p>
            <p>{provider?.area}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">District:</p>
            <p>{provider?.district}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">City:</p>
            <p>{provider?.city}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Pincode:</p>
            <p>{provider?.pincode}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">State:</p>
            <p>{provider?.state}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Service Type:</p>
            <p>{provider?.serviceType}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Verified Status:</p>
            <p>{provider?.isVerified ? "Verified" : "Not Verified"}</p>
          </div>
        </div>
      </div>
      {/* Departments Section */}
      <div className="mt-12">
        <h1 className="text-md  mb-6 text-center text-gray-900">
          select any Department
        </h1>

        {provider?.departments && provider.departments.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-9">
            {provider.departments.map((department) => (
              <div
                key={department._id}
                className="bg-white text-black p-3 rounded-lg text-center shadow-md w-45 flex flex-col justify-center items-center 
                         hover:border-black border transition-all duration-300 transform hover:scale-110  hover:shadow-xl cursor-pointer"
                         onClick={()=>handleDepartment(department._id)}
              >
                <p className="text-md font-medium break-words">
                  {department.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No departments available</p>
        )}
      </div>

      {/* Map Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-center">Location</h2>
        <div className="relative w-full h-80 shadow-lg rounded-lg overflow-hidden">
          {spInfo ? (
            <MyMap spInfo={spInfo} />
          ) : (
            <p>No location data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalClinicDetailsPage;
