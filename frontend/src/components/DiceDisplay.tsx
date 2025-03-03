import React from "react";
import { DiceType } from "../utils/diceUtils";
import DiceIcons from "./DiceIcons";

interface DiceDisplayProps {
  selectedDice: { [key in DiceType]: number };
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({ selectedDice }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {Object.entries(selectedDice).map(([diceType, count]) => (
        <div key={diceType} className="flex flex-col items-center">
          <img
            src={DiceIcons[diceType as DiceType]}
            alt={diceType}
            className="w-10 h-10"
          />
          <div className="badge badge-outline border-gray-500 text-white mt-1">
            {count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiceDisplay;
