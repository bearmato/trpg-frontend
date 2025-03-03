import React, { useState } from "react";
import DiceDisplay from "./DiceDisplay";
import DiceControls from "./DiceControls";
import { DiceType, rollDice } from "../utils/diceUtils";

const DiceRoller: React.FC = () => {
  const [selectedDice, setSelectedDice] = useState<{
    [key in DiceType]: number;
  }>({
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0,
    d100: 0,
  });
  const [results, setResults] = useState<{ type: DiceType; value: number }[]>(
    []
  );
  const [modifier, setModifier] = useState(0);

  const handleRoll = () => {
    setResults(rollDice(selectedDice));
  };

  return (
    <div className="p-6 bg-black text-gray-200 rounded-lg shadow-lg max-w-lg mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        🎲 Dice Roller
      </h2>

      {/* 骰子显示区 */}
      <DiceDisplay selectedDice={selectedDice} />

      {/* 操作区 */}
      <DiceControls
        selectedDice={selectedDice}
        setSelectedDice={setSelectedDice}
        modifier={modifier}
        setModifier={setModifier}
        onRoll={handleRoll}
      />

      {/* 结果显示 */}
      {results.length > 0 && (
        <div className="alert bg-gray-900 text-white mt-3 border-gray-600">
          <span>
            Total:{" "}
            {results.reduce((sum, dice) => sum + dice.value, 0) + modifier}
          </span>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
