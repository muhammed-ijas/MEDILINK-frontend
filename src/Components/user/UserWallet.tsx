import React, { useEffect, useState } from 'react';
import WalletAppointmentView from "../../Components/user/WalletAppointmentView"; // Assuming you have this modal component
import { getWalletDetails } from '../../api/user';

// Define the WalletItem interface
interface WalletItem {
    appointmentId: {
        _id: string; // Use string for appointment ID
        user: string;
        serviceProvider: {
            name: string;
            profileImage: string;
        };
        department: {
            name: string;
        };
        doctor: {
            name: string;
        };
        bookingDate: Date;
        timeSlot: string;
        patientName: string;
        patientAge: number;
        patientEmail: string;
        patientPhone: string;
        amount: number;
        paymentStatus: "pending" | "completed" | "failed";
        createdAt: Date;
        bookingStatus: "pending" | "Approved" | "rejected" | "completed" | "cancelled";
        qrCode?: string;
        prescription?: Medication[];
    };
    date: Date;
    amount: number;
    isPlus: boolean;
}

// Define the Medication interface
export interface Medication {
    medication: string;
    dosage: string;
    frequency: string;
    route: string;
    duration: string;
    instructions: string;
    refills?: number;
}

// UserWallet component definition
const UserWallet: React.FC<{ Id: string }> = ({ Id }) => {
    const [walletData, setWalletData] = useState<WalletItem[]>([]); // Specify the type as WalletItem[]
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState<WalletItem["appointmentId"] | null>(null); // Update type to match WalletAppointmentView props
    const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility

    // Function to fetch wallet data
    const getWallet = async () => {
        try {
            const response = await getWalletDetails(Id);
            console.log("Response from API:", response); // Log the response to inspect its structure

            // Check if the response is an array directly and set walletData
            setWalletData(Array.isArray(response) ? response : []); // Default to empty array if response is not an array
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWallet();
    }, [Id]);

    const handleViewAppointment = (item: WalletItem) => {
        setModalData(item.appointmentId); // Pass only the appointmentId to the modal
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    // Calculate the total balance based on isPlus
    const totalBalance = walletData.reduce((total, item) => {
        return item.isPlus ? total + item.amount : total - item.amount;
    }, 0);

    if (loading) return <div className="text-center">Loading...</div>;

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">User Wallet</h2>
            <div className="mb-4">
                <h3 className="text-lg font-bold">
                    Balance: {totalBalance > 0 ? `${totalBalance} Rupees` : '0 Rupees'}
                </h3>
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Appointment ID</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {walletData.length > 0 ? (
                        walletData.map((item) => (
                            <tr key={item.appointmentId._id}> {/* Using the appointmentId _id as the key */}
                                <td className="border border-gray-200 px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="border border-gray-200 px-4 py-2">{item.appointmentId._id}</td>
                                <td className="border border-gray-200 px-4 py-2">{item.amount}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <button
                                        onClick={() => handleViewAppointment(item)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="border border-gray-200 px-4 py-2 text-center">No transactions found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for viewing appointment details */}
            {isModalOpen && modalData && (
                <WalletAppointmentView
                    appointment={modalData} // Pass the appointmentId directly
                    onClose={handleCloseModal}
                    isOpen={isModalOpen} // Control modal visibility
                />
            )}
        </div>
    );
};

export default UserWallet;
