import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "../../redux/store";
import { setCredentials } from "../../redux/slices/spSlice";
import {
  changeFirstDocumentImage,
  changeSecondDocumentImage,
} from "../../api/SP";
import DocumentFullViewModal from "../../Components/admin/DocumentFullviewModal"; // Import the DocumentFullViewModal component

interface DocumentModalProps {
  serviceType: string;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  serviceType,
  onClose,
}) => {
  const [firstIsLoading, setFirstIsLoading] = useState(false);
  const [secondIsLoading, setSecondIsLoading] = useState(false);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false); // State for full view modal
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null); // State for selected image URL

  const dispatch = useDispatch();
  const { spInfo } = useSelector((state: RootState) => state.sp);

  const firstDocumentText =
    serviceType === "ambulance"
      ? "RC Document"
      : serviceType === "homeNurse"
      ? "Nursing Certificate"
      : "Registration Certificate";

  const secondDocumentText =
    serviceType === "Ambulance"
      ? "Ambulance Permit"
      : serviceType === "homeNurse"
      ? "License"
      : "License";

  const handleDocumentChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {

    // console.log("ja use bathaaaseeee :",spInfo.inVerified)
    if(spInfo.isVerified==true){
      toast.error("you can't change the document once you verified")
      return 
    }

    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images_preset");
      formData.append("cloud_name", "dhq8p5oyj");

      try {
        if (documentType === "first") {
          setFirstIsLoading(true);
        } else {
          setSecondIsLoading(true);
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dhq8p5oyj/image/upload",
          formData
        );

        const cloudinaryUrl = cloudinaryResponse.data.secure_url;

        // Update the document URL in the database
        let response;
        if (documentType === "first") {
          response = await changeFirstDocumentImage(spInfo._id, cloudinaryUrl);
        } else {
          response = await changeSecondDocumentImage(spInfo._id, cloudinaryUrl);
        }

        if (response) {
          toast.success("successfully uploaded");

          // Update the Redux state and local storage with the new document URL
          const updatedSpInfo = {
            ...spInfo,
            firstDocumentImage:
              documentType === "first"
                ? cloudinaryUrl
                : spInfo.firstDocumentImage,
            secondDocumentImage:
              documentType === "second"
                ? cloudinaryUrl
                : spInfo.secondDocumentImage,
          };

          dispatch(setCredentials(updatedSpInfo)); // Update Redux state and localStorage
        }
        if (documentType === "first") {
          setFirstIsLoading(false);
        } else {
          setSecondIsLoading(false);
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        toast.error("Failed to upload document"); // Show error toast
        setFirstIsLoading(true);
        setSecondIsLoading(true);
      }
    }
  };

  // Handle opening the full view modal
  const handleOpenFullView = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsFullViewOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Toaster position="top-center"/>
        <div className="bg-white rounded-lg p-8 shadow-lg w-11/12 max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Edit Documents</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
          </div>

          <div className="flex justify-between gap-6">
            {/* First Document */}
            <div className="flex flex-col items-center">
              <label className="font-semibold text-gray-600 mb-2">
                {firstDocumentText}
              </label>
              {firstIsLoading ? (
                <div className="flex items-center justify-center w-36 h-36 rounded-lg bg-gray-100">
                  <div
                    className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : spInfo?.firstDocumentImage ? (
                <img
                  src={spInfo.firstDocumentImage}
                  alt="First Document"
                  className="w-36 h-36 rounded-lg object-cover shadow-md cursor-pointer"
                  onClick={() => handleOpenFullView(spInfo.firstDocumentImage)} // Open full view on click
                />
              ) : (
                <div className="flex items-center justify-center w-36 h-36 bg-gray-200 rounded-lg shadow-inner">
                  <span className="text-gray-500">No Document</span>
                </div>
              )}
              <div className="mt-3">
                <label
                  htmlFor="firstDocumentUpload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 shadow-md transition duration-300"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </label>
                <input
                  id="firstDocumentUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDocumentChange(e, "first")}
                  className="hidden"
                />
              </div>
            </div>

            {/* Second Document */}
            <div className="flex flex-col items-center">
              <label className="font-semibold text-gray-600 mb-2">
                {secondDocumentText}
              </label>
              {secondIsLoading ? (
                <div className="flex items-center justify-center w-36 h-36 rounded-lg bg-gray-100">
                  <div
                    className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : spInfo?.secondDocumentImage ? (
                <img
                  src={spInfo.secondDocumentImage}
                  alt="Second Document"
                  className="w-36 h-36 rounded-lg object-cover shadow-md cursor-pointer"
                  onClick={() => handleOpenFullView(spInfo.secondDocumentImage)} // Open full view on click
                />
              ) : (
                <div className="flex items-center justify-center w-36 h-36 bg-gray-200 rounded-lg shadow-inner">
                  <span className="text-gray-500">No Document</span>
                </div>
              )}
              <div className="mt-3">
                <label
                  htmlFor="secondDocumentUpload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 shadow-md transition duration-300"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </label>
                <input
                  id="secondDocumentUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDocumentChange(e, "second")}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full View Modal */}
      {selectedImageUrl && (
        <DocumentFullViewModal
          imageUrl={selectedImageUrl}
          isOpen={isFullViewOpen}
          onClose={() => setIsFullViewOpen(false)}
        />
      )}
    </>
  );
};

export default DocumentModal;
