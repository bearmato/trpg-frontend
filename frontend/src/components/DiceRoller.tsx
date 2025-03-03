import React, { useState } from "react";

// 导入骰子图片
import d4Icon from "../assets/dice/D4.png";
import d6Icon from "../assets/dice/D6.png";
import d8Icon from "../assets/dice/D8.png";
import d10Icon from "../assets/dice/D10.png";
import d12Icon from "../assets/dice/D12.png";
import d20Icon from "../assets/dice/D20.png";
import d100Icon from "../assets/dice/D100.png";

// 定义骰子类型
type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

// 骰子图标映射
const diceIcons: { [key in DiceType]: string } = {
  d4: d4Icon,
  d6: d6Icon,
  d8: d8Icon,
  d10: d10Icon,
  d12: d12Icon,
  d20: d20Icon,
  d100: d100Icon,
};

const DiceRoller: React.FC = () => {
  // 存储各类骰子的数量
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

  // 存储投掷结果
  const [results, setResults] = useState<{ type: DiceType; value: number }[]>(
    []
  );

  // 修正值
  const [modifier, setModifier] = useState(0);

  // 添加骰子方法
  const addDice = (diceType: DiceType) => {
    setSelectedDice((prev) => ({
      ...prev,
      [diceType]: prev[diceType] + 1,
    }));
  };

  // 移除骰子方法
  const removeDice = (diceType: DiceType) => {
    setSelectedDice((prev) => ({
      ...prev,
      [diceType]: Math.max(0, prev[diceType] - 1),
    }));
  };

  // 清空所有骰子
  const clearAllDice = () => {
    setSelectedDice({
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
      d20: 0,
      d100: 0,
    });
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
  };

  // 重置所有 (清空骰子选择，修正值和结果)
  const resetAll = () => {
    clearAllDice();
    setModifier(0);
    clearResults();
  };

  // 投掷骰子方法
  const rollDice = () => {
    const newResults: { type: DiceType; value: number }[] = [];

    // 遍历所有选择的骰子类型
    Object.entries(selectedDice).forEach(([type, quantity]) => {
      if (quantity > 0) {
        const max = parseInt(type.substring(1));

        // 为每个骰子生成随机值
        for (let i = 0; i < quantity; i++) {
          newResults.push({
            type: type as DiceType,
            value: Math.floor(Math.random() * max) + 1,
          });
        }
      }
    });

    // 更新结果，最多显示10个
    setResults(newResults);
  };

  // 计算总和方法
  const calculateTotal = () => {
    return results.reduce((sum, dice) => sum + dice.value, 0) + modifier;
  };

  // 获取已选骰子摘要
  const getSelectedDiceSummary = () => {
    const summary = Object.entries(selectedDice)
      .filter(([_, quantity]) => quantity > 0)
      .map(([type, quantity]) => `${quantity}${type}`);

    if (summary.length === 0) return "No dice selected";
    return summary.join(" + ");
  };

  // 检查是否有骰子被选中
  const hasDiceSelected = Object.values(selectedDice).some(
    (count) => count > 0
  );

  return (
    <div className="p-6 bg-black text-gray-200 rounded-lg shadow-lg max-w-lg mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        🎲 Dice Roller
      </h2>

      {/* 骰子选择区域 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.keys(diceIcons).map((diceType) => (
          <div key={diceType} className="flex flex-col items-center">
            <div className="join flex items-center">
              {/* 减少按钮 */}
              <button
                onClick={() => removeDice(diceType as DiceType)}
                className="btn btn-xs btn-square join-item bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                disabled={selectedDice[diceType as DiceType] === 0}
              >
                -
              </button>

              {/* 骰子图标 */}
              <button
                onClick={() => addDice(diceType as DiceType)}
                className="w-12 h-12 flex items-center justify-center bg-gray-900 border border-gray-500 rounded-sm cursor-pointer hover:bg-gray-800"
              >
                <img
                  src={diceIcons[diceType as DiceType]}
                  alt={diceType}
                  className="w-8 h-8"
                />
              </button>

              {/* 增加按钮 */}
              <button
                onClick={() => addDice(diceType as DiceType)}
                className="btn btn-xs btn-square join-item bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              >
                +
              </button>
            </div>

            {/* 显示骰子类型 */}
            <div className="text-gray-400 text-xs mt-1">{diceType}</div>

            {/* 显示当前骰子数量 */}
            <div className="badge badge-outline border-gray-500 text-white mt-1">
              {selectedDice[diceType as DiceType]}
            </div>
          </div>
        ))}
      </div>

      {/* 当前选择的骰子摘要 */}
      <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Current selection:</div>
          {hasDiceSelected && (
            <button
              onClick={clearAllDice}
              className="btn btn-xs bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="text-white font-medium mt-1">
          {getSelectedDiceSummary()}
          {modifier !== 0 && ` + ${modifier}`}
        </div>
      </div>

      {/* 修正值输入区域 */}
      <div className="form-control w-full max-w-xs mx-auto mb-4">
        <label className="label">
          <span className="label-text text-gray-400">
            Enter modifier value (e.g., +2, -1)
          </span>
        </label>
        <input
          type="number"
          value={modifier}
          onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
          className="input input-bordered w-full bg-gray-900 text-white border-gray-600 focus:ring-gray-400"
          placeholder="Enter a modifier"
        />
      </div>

      {/* 投掷按钮 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={rollDice}
          disabled={!hasDiceSelected}
          className="btn flex-1 bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
        >
          🎲 Roll Dice
        </button>

        <button
          onClick={resetAll}
          className="btn bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
        >
          Reset All
        </button>
      </div>

      {/* 结果显示区域 */}
      {results.length > 0 && (
        <div className="mt-4">
          {/* 总和 */}
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-3 flex justify-between items-center">
            <span className="font-bold text-white">
              Total: {calculateTotal()}
            </span>
            <button
              onClick={clearResults}
              className="btn btn-xs bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>

          {/* 单个骰子结果 */}
          <div className="grid grid-cols-4 gap-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-900 p-2 text-center rounded-md border border-gray-700"
              >
                <div className="font-bold">{result.type}</div>
                <div>{result.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
