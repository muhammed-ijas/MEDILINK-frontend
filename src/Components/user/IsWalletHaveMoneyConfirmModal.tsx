import { useEffect, useState } from 'react';
import { isWalletHaveMoney, confirmWalletPayment } from '../../api/user';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Define a type for the body object
type PaymentBodyType = {
  amount: number;
  currency: string;
  userInfo: any; // You can replace 'any' with a more specific type if you have it
  doctorId: string;
  bookingDate: string;
  timeSlot: string;
  patientName: string;
  patientAge: number | "";
  patientEmail: string;
  patientPhone: string;
};

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  body: PaymentBodyType;
};

const IsWalletHaveMoneyConfirmModal = ({ isOpen, closeModal, body }: ModalProps) => {
  const [walletStatus, setWalletStatus] = useState<{ hasEnoughMoney: boolean; balance: number } | null>(null); // State to store wallet status
  const navigate = useNavigate(); // Hook to navigate to another page

  // API call inside useEffect when modal opens
  useEffect(() => {
    if (isOpen) {
      const checkWallet = async () => {
        try {
          const response = await isWalletHaveMoney(body.userInfo._id); // Call API with userId
          console.log("response    :", response);
          setWalletStatus(response); // Set the wallet status in state
        } catch (error) {
          console.error('Error checking wallet:', error);
        }
      };
      checkWallet();
    }
  }, [isOpen, body.userInfo._id]);

  const handleConfirmPayment = async () => {
    try {
      // Call confirmWalletPayment with necessary data
      const response = await confirmWalletPayment(body);
      console.log("response :",response);

      // Show a toast notification
      toast.success('Successfully booked your appointment!');

      // Navigate to the bookings page
      navigate('/user/bookings');
      closeModal(); // Close the modal after confirming payment
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Failed to confirm payment. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Wallet Payment</h2>
        
        {/* Display wallet balance based on the walletStatus */}
        {walletStatus ? (
          <>
            {walletStatus.balance >= 50 ? (
              <>
                <p>Your wallet balance: ₹{walletStatus.balance}</p>
                <p>You can continue with the payment.</p>
                <button
                  onClick={handleConfirmPayment}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                >
                  Confirm Payment
                </button>
              </>
            ) : (
              <>
                <p>Insufficient wallet balance. Current balance: ₹{walletStatus.balance}</p>
                <p>You don't have enough balance in your wallet to do the payment.</p>
              </>
            )}
          </>
        ) : (
          <p>Checking wallet balance...</p>
        )}

        <div className="mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsWalletHaveMoneyConfirmModal;
