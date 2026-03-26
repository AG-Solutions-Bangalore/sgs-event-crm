import React from 'react';
import { Modal, Button } from 'antd';

const CropImageModal = ({ open, imageSrc, onCancel, onCropComplete, title = "Crop Image" }) => {
  const handleConfirm = () => {
    // This is a placeholder that bypasses actual cropping
    // It converts the imageSrc (data URL) back to a blob if needed, 
    // but usually onCropComplete expects { blob, fileUrl }
    
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        onCropComplete({ blob, fileUrl: imageSrc });
      });
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleConfirm}>Confirm</Button>
      ]}
    >
      <div className="flex justify-center p-4 bg-gray-50 rounded border border-dashed border-gray-200">
        <img src={imageSrc} alt="To crop" className="max-h-[400px] object-contain" />
      </div>
      <p className="text-center text-xs text-gray-500 mt-2 italic">
        Cropping functionality is currently simplified to direct upload.
      </p>
    </Modal>
  );
};

export default CropImageModal;
