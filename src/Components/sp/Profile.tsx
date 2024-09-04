import React, { useState } from "react";
import { editProfile } from "../../api/SP";
import { toast } from "react-toastify";
import profilePageImage from "../../../public/logo/HomePage/ProfileImage.png";
interface ProfileProps {
  profile: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    area: string;
    city: string;
    latitude: number;
    longitude: number;
    state: string;
    pincode: number;
    district: string;
    closingTime: string;
    openingTime: string;
  };
  state: (data: boolean) => void;
}

const Profile = ({ profile = { _id : '',name: '', email: '', phone: '', area: '', city: '', district: '', state: '', pincode: 0, latitude: 0, longitude: 0, openingTime: '', closingTime: '' }, state }: ProfileProps) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [area, setArea] = useState(profile.area);
  const [city, setCity] = useState(profile.city);
  const [district, setDistrict] = useState(profile.district);
  const [profileState, setProfileState] = useState(profile.state);
  const [closingTime, setClosingTime] = useState(profile.closingTime);
  const [openingTime, setOpeningTime] = useState(profile.openingTime);
  const [pincode, setPincode] = useState(profile.pincode);
  const [longitude, setLongitude] = useState(profile.longitude);
  const [latitude, setLatitude] = useState(profile.latitude);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { name, email, phone, area, city, district, state: profileState, pincode, latitude, longitude, openingTime, closingTime };
    const response = await editProfile(profile._id, formData);
    toast.success(response?.data.message, { position: "top-center" });
    state(true);
  };
  return (
    <div className=" h-[500px] w-full rounded-lg p-6 bg-white">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={profilePageImage}
            alt="Profile"
            className="w-64 h-64 object-cover rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start p-6 bg-white">
          <form className="w-full max-w-md mt-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Phone:
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="area"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Area:
                </label>
                <input
                  type="text"
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="district"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  District:
                </label>
                <input
                  type="text"
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="stateLocation"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  State:
                </label>
                <input
                  type="text"
                  id="stateLocation"
                  value={profileState}
                  onChange={(e) => setProfileState(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label
                  htmlFor="openingTime"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Opening Time:
                </label>
                <input
                  type="text"
                  id="openingTime"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="closingTime"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Closing Time:
                </label>
                <input
                  type="text"
                  id="closingTime"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="pincode"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Pincode:
                </label>
                <input
                  type="number"
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(Number(e.target.value))}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="latitude"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Latitude:
                </label>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="longitude"
                  className="block mb-2 text-black text-sm md:text-base font-medium"
                >
                  Longitude:
                </label>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-blue-900 transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
