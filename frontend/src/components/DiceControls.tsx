import React from "react";
import { DiceType } from "../utils/diceUtils";
import DiceIcons from "./DiceIcons";

interface DiceControlsProps {
  selectedDice: { [key in DiceType]: number };
  setSelectedDice: React.Dispatch<
    React.SetStateAction<{ [key in DiceType]: number }>
  >;
  modifier: number;
  setModifier: React.Dispatch<React.SetStateAction<number>>;
  onRoll: () => void;
}

const DiceControls: React.FC<DiceControlsProps> = ({
  selectedDice,
  setSelectedDice,
  modifier,
  setModifier,
  onRoll,
}) => {
  const addDice = (type: DiceType) => {
    setSelectedDice((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const removeDice = (type: DiceType) => {
    setSelectedDice((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <>
      {/* 选择骰子 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.keys(DiceIcons).map((diceType) => (
          <div key={diceType} className="flex flex-col items-center">
            <div className="join flex items-center">
              <button
                onClick={() => removeDice(diceType as DiceType)}
                className="btn btn-xs btn-square bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                disabled={selectedDice[diceType as DiceType] === 0}
              >
                -
              </button>
              <button
                onClick={() => addDice(diceType as DiceType)}
                className="w-12 h-12 flex items-center justify-center bg-gray-900 border border-gray-500 rounded-sm cursor-pointer hover:bg-gray-800"
              >
                <img
                  src={DiceIcons[diceType as DiceType]}
                  alt={diceType}
                  className="w-10 h-10"
                />
              </button>
              <button
                onClick={() => addDice(diceType as DiceType)}
                className="btn btn-xs btn-square bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 修正值输入框 */}
      <div className="form-control w-full max-w-xs mx-auto mb-4">
        <label className="label">
          <span className="label-text text-gray-400">Enter modifier value</span>
        </label>
        <input
          type="number"
          value={modifier}
          onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
          className="input input-bordered w-full bg-gray-900 text-white border-gray-600 focus:ring-gray-400"
        />
      </div>

      {/* 投掷按钮 */}
      <button
        onClick={onRoll}
        className="btn w-full bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
      >
        🎲 Roll Dice
      </button>
    </>
  );
};

export default DiceControls;
