import React from "react";
import DiceRoller from "../components/DiceRoller";

const DicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <DiceRoller />
      </div>
    </div>
  );
};

export default DicePage;
