import React from "react";
import BackgroundForm from "./BackgroundForm";

interface BackgroundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (background: string) => void;
}

const BackgroundDialog: React.FC<BackgroundDialogProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-base-100 rounded-lg shadow-xl">
          <BackgroundForm onGenerated={onGenerated} onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default BackgroundDialog;
