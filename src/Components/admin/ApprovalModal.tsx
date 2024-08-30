import React from "react";
import Swal from 'sweetalert2';
import { approveService } from "../../api/admin";

interface ServiceProvider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  city: string;
  district: string;
  state: string;
  profileImage: string;
  isVerified: boolean;
  pincode: number;
  isBlocked: boolean;
  serviceType: string;
}

interface ApprovalModalProps {
    provider: ServiceProvider | null;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (providerId: string) => void; // New prop
  }

const ApprovalModal: React.FC<ApprovalModalProps> = ({ provider, isOpen, onClose ,onApprove  }) => {
    const handleApprove = async () => {
        if (provider) {
          const { isConfirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00bcd4',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'Cancel',
          });
    
          if (isConfirmed) {
            try {
              await approveService(provider._id);
              Swal.fire('Approved!', 'The service provider has been approved.', 'success');
              onApprove(provider._id); // Notify parent component of approval
              onClose(); // Close the modal after approval
            } catch (error) {
              Swal.fire('Failed!', 'Failed to approve the service provider.', 'error');
            }
          }
        }
      };

  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <img
            src={provider.profileImage}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-lg"
          />
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{provider.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-left text-gray-700">
            <p><strong>Phone:</strong> {provider.phone}</p>
            <p><strong>Area:</strong> {provider.area}</p>
            <p><strong>City:</strong> {provider.city}</p>
            <p><strong>District:</strong> {provider.district}</p>
            <p><strong>State:</strong> {provider.state}</p>
            <p><strong>Pincode:</strong> {provider.pincode}</p>
            <p><strong>Is Blocked:</strong> {provider.isBlocked ? "true" : "false"}</p>
            <p><strong>Service Type:</strong> {provider.serviceType}</p>
            <p className="col-span-2"><strong>Email:</strong> {provider.email}</p>
          </div>
        </div>
       
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleApprove}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 mr-4"
          >
            Approve
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
