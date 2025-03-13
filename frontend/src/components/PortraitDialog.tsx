import React from "react";
import PortraitForm from "./PortraitForm";
import { CharacterData } from "../types/character";

interface PortraitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (portraitUrl: string) => void;
  initialData?: CharacterData;
  onSaveCharacter?: (data: CharacterData) => void;
  openBackgroundDialog?: () => void;
}

const PortraitDialog: React.FC<PortraitDialogProps> = ({
  isOpen,
  onClose,
  onGenerated,
  initialData,
  onSaveCharacter,
  openBackgroundDialog,
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
          <PortraitForm
            onGenerated={onGenerated}
            onClose={onClose}
            initialData={initialData}
            onSaveCharacter={onSaveCharacter}
            openBackgroundDialog={openBackgroundDialog}
          />
        </div>
      </div>
    </>
  );
};

export default PortraitDialog;
