import  { useEffect, useState } from 'react';
import { getUnVerifiedServices } from '../../api/admin';
import ApprovalModal from '../../Components/admin/ApprovalModal';

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
  firstDocumentImage: string;
  secondDocumentImage: string;
}

const Requests = () => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getUnVerifiedServices();
        setServiceProviders(Array.isArray(data.services) ? data.services : []);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch service providers');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleApprove = (providerId: string) => {
    setServiceProviders(serviceProviders.filter(p => p._id !== providerId)); // Remove approved provider
  };

  const handleViewService = (id: string) => {
    const provider = serviceProviders.find(p => p._id === id);
    if (provider) {
      setSelectedProvider(provider);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Service Providers Requests</h2>
      {serviceProviders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white">No unverified service providers</p>
        </div>
      ) : (
        <table className="min-w-full bg-black border border-gray-300 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-black  text-left">
              <th className="py-3 px-6">Profile</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Area</th>
              <th className="py-3 px-6">District</th>
              <th className="py-3 px-6">State</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceProviders.map(provider => (
              <tr key={provider._id} className="border-t border-gray-200">
                <td className="py-3 px-6">
                  <img
                    src={provider.profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="py-3 px-6">{provider.name}</td>
                <td className="py-3 px-6">{provider.phone}</td>
                <td className="py-3 px-6">{provider.area}</td>
                <td className="py-3 px-6">{provider.district}</td>
                <td className="py-3 px-6">{provider.state}</td>
                <td className="py-3 px-6">{provider.email}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleViewService(provider._id)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Render the modal */}
      <ApprovalModal
        provider={selectedProvider}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove} // Pass the onApprove function
      />
    </div>
  );
};

export default Requests;
