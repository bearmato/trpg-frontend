import React, { useState } from "react";

type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

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

  // 添加骰子
  const addDice = (diceType: DiceType) => {
    setSelectedDice((prev) => ({ ...prev, [diceType]: prev[diceType] + 1 }));
  };

  //  移除骰子
  const removeDice = (diceType: DiceType) => {
    setSelectedDice((prev) => ({
      ...prev,
      [diceType]: Math.max(0, prev[diceType] - 1),
    }));
  };

  //  投掷骰子
  const rollDice = () => {
    const newResults: { type: DiceType; value: number }[] = [];
    Object.entries(selectedDice).forEach(([type, quantity]) => {
      if (quantity > 0) {
        const max = parseInt(type.substring(1));
        for (let i = 0; i < quantity; i++) {
          newResults.push({
            type: type as DiceType,
            value: Math.floor(Math.random() * max) + 1,
          });
        }
      }
    });
    setResults([...newResults, ...results].slice(0, 10));
  };

  //  计算总和
  const calculateTotal = () =>
    results.reduce((sum, dice) => sum + dice.value, 0) + modifier;

  // 定义骰子 SVG
  const diceSVGs: { [key in DiceType]: React.JSX.Element } = {
    d4: (
      <svg
        className="text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 216 216"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="12"
          d="M108,108 L24.86,156 M108,12 L108,108 M191.14,156 L108,108
        M108,12 L191.14,156 L24.86,156z"
        />
      </svg>
    ),
    d6: (
      <svg
        className=" text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 216 216"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="12"
          d="M24.9,60 L108,108 M191.1,60 L 108,108 M108,204 L108,108
M191.1,60 L191.1,156 L108,204 L24.9,156 L24.9,60 L108,12z"
        />
      </svg>
    ),
    d8: (
      <svg
        className="text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 216 216"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="12"
          d="m24.86,60 L191.13,60 L108,204z
        M24.86,156 L24.86,60 L108,12 L191.13,60 L191.14,156 L108,204z"
        />
      </svg>
    ),
    d10: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-white"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <polygon
          points="12 2 4 7 12 12 20 7"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polygon
          points="12 12 4 17 12 22 20 17"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    d12: (
      <svg
        className="text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 216 216"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="12"
          d="M157.88,50.4 L108.7,60.14 L58.12,50.4 L83.06,36 L136.5,36z
        M157.88,50.4 L182.83,93.6 L149.57,132 L108.7,108.4 L108.33,108.61 L107.99,108 L108.7,60.14z
        M182.83,93.6 L182.82,122.4 L157.88,165.6 L132.94,180 L149.57,132z
        M149.57,132 L132.94,180 L83.08,180 L66.43,132 L108.33,108.61 L108.7,108.4z
        M66.43,132 L83.08,180 L58.12,165.6 L33.18,122.4 L33.17,93.6z
        M108.7,60.14 L107.99,108 L108.33,108.61 L66.43,132 L33.17,93.6 L58.12,50.4z"
        />
      </svg>
    ),
    d20: (
      <svg
        className="text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 216 216"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="12"
          d="M191.14,60 L191.14,156 L159.96,78z
        M159.96,78 L191.14,156 L108,168z
        M191.14,60 L159.96,78 L108,12z
        M191.14,156 L108,204 L108,168z
        M108,12 L159.96,78 L56.04,78z
        M159.96,78 L108,168 L56.04,78z
        M108,168 L108,204 L24.86,156z
        M108,12 L56.04,78 L24.86,60z
        M56.04,78 L108,168 L24.86,156z
        M56.04,78 L24.86,156 L24.86,60z"
        />
      </svg>
    ),
    d100: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-white"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">
          %
        </text>
      </svg>
    ),
  };

  return (
    <div className="p-6 bg-black text-gray-200 rounded-lg shadow-lg max-w-lg mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        🎲 DiceRoller
      </h2>

      {/* 选择骰子 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.keys(diceSVGs).map((diceType) => (
          <div key={diceType} className="flex flex-col items-center">
            <div className="join flex items-center">
              <button
                onClick={() => removeDice(diceType as DiceType)}
                className="btn btn-xs btn-square join-item bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                disabled={selectedDice[diceType as DiceType] === 0}
              >
                -
              </button>
              <button
                onClick={() => addDice(diceType as DiceType)}
                className="w-12 h-12 flex items-center justify-center bg-gray-900 border border-gray-500 rounded-sm cursor-pointer hover:bg-gray-800"
              >
                {diceSVGs[diceType as DiceType]}
              </button>
              <button
                onClick={() => addDice(diceType as DiceType)}
                className="btn btn-xs btn-square join-item bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              >
                +
              </button>
            </div>
            <div className="badge badge-outline border-gray-500 text-white mt-1">
              {selectedDice[diceType as DiceType]}
            </div>
          </div>
        ))}
      </div>

      {/* 调整值输入框 */}
      <div className="form-control w-full max-w-xs mx-auto mb-4">
        <label className="label">
          <span className="label-text text-gray-400">
            Enter modifier value(e.g., +2, -1)
          </span>
        </label>
        <input
          type="number"
          value={modifier}
          onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
          className="input input-bordered w-full bg-gray-900 text-white border-gray-600 focus:ring-gray-400"
          placeholder="Enter a modifier "
        />
      </div>

      {/* 投掷按钮 */}
      <button
        onClick={rollDice}
        className="btn w-full bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
      >
        🎲 Roll Dice
      </button>

      {/* 结果显示 */}
      {results.length > 0 && (
        <div className="alert bg-gray-900 text-white mt-3 border-gray-600">
          <span>Total: {calculateTotal()}</span>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
