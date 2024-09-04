import React, { useState } from "react";

interface DocumentFullViewModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentFullViewModal: React.FC<DocumentFullViewModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Handle zooming in and out with the mouse wheel
  const handleWheel = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.1, 3)); // Scroll up to zoom in
    } else {
      setZoomLevel((prev) => Math.max(prev - 0.1, 1)); // Scroll down to zoom out
    }
  };

  // Close the modal when clicking outside the image
  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-pointer"
      onClick={handleBackgroundClick} // Handle click outside the image
    >
      <div
        className="relative"
        onWheel={handleWheel} // Handle zooming with scroll
      >
        <img
          src={imageUrl}
          alt="Document"
          className="object-contain max-h-screen max-w-full"
          style={{ transform: `scale(${zoomLevel})` }}
        />
      </div>
    </div>
  );
};

export default DocumentFullViewModal;
