import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";


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



interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Profile) => Promise<void>;
}




const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onClose,
  onSave,
}) => {
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };


  const handleSave = async () => {
    await onSave(editedProfile);
    onClose();
  };


  const isServiceTypeDisabled = editedProfile.isVerified===true;



  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg  max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form>
          <div>
            <label className="block font-semibold text-gray-700 ">Name:</label>
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Email:</label>
            <input
              type="text"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={editedProfile.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Area:</label>
            <input
              type="text"
              name="area"
              value={editedProfile.area}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              District:
            </label>
            <input
              type="text"
              name="district"
              value={editedProfile.district}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">City:</label>
            <input
              type="text"
              name="city"
              value={editedProfile.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Pincode:
            </label>
            <input
              type="number"
              name="pincode"
              value={editedProfile.pincode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">State:</label>
            <input
              type="text"
              name="state"
              value={editedProfile.state}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div className="relative">
            <label className="block font-semibold text-gray-700">
              Service Type:
            </label>
            <select
              name="serviceType"
              value={editedProfile.serviceType}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              disabled={isServiceTypeDisabled}
            >
              <option value="">Select a service type</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="homeNurse">Home Nurse</option>
              <option value="ambulance">Ambulance</option>
            </select>
            {isServiceTypeDisabled && (
              <p className="text-red-500 text-sm mt-1">
                Service type cannot be changed once verified by Admin.
              </p>
            )}
          </div>


          
         
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

