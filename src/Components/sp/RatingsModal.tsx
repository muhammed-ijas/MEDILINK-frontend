import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Review {
  doctorName: string;
  patientName: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface RatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
}

const RatingsModal: React.FC<RatingsModalProps> = ({ isOpen, onClose, reviews }) => {
  if (!isOpen) return null;

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Can use moment.js for more control
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Ratings and Reviews</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{review.doctorName}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{review.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                      {"★".repeat(review.rating)} <span className="text-gray-500 ml-1">({review.rating})</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs whitespace-normal text-sm text-gray-600 break-words">
                      {review.review}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(review.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-600">No reviews yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RatingsModal;
