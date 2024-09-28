import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateStatus } from '../../api/user';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string | null>(null); // State to store QR code

  useEffect(() => {
    const updateBookingStatus = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');

        if (bookingId) {
          const response = await updateStatus({ bookingId, status: 'completed' });
          setQrCode(response.qrCode); // Set QR code to state
        }

        setTimeout(() => {
          navigate('/user/bookings');
        }, 3000);
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    };

    updateBookingStatus();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-center p-6">
      <div className="animate-spin border-8 border-t-8 border-blue-500 border-transparent rounded-full w-24 h-24 mb-4"></div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
      <p className="text-lg text-gray-600">Your payment was successful, and your appointment is confirmed.</p>
      
      {qrCode && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Your QR Code:</h2>
          <img src={qrCode} alt="QR Code" className="mt-4" />
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
