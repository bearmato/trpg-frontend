// steps/BasicInfoStep.tsx

import React from "react";
import { Character } from "../types/character";

interface BasicInfoStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">基本信息</h2>
        <div className="form-control w-full max-w-md mx-auto">
          <label className="label">
            <span className="label-text text-lg">角色名称</span>
          </label>
          <input
            type="text"
            placeholder="输入你的角色名称"
            className="input input-bordered w-full"
            value={character.name}
            onChange={(e) => updateCharacter("name", e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            取一个符合游戏世界观的名字，这将是你在冒险中的称呼。
          </p>
        </div>

        <div className="form-control w-full max-w-md mx-auto mt-6">
          <label className="label">
            <span className="label-text text-lg">角色等级</span>
          </label>
          <div className="flex items-center">
            <button
              className="btn btn-sm btn-circle"
              onClick={() =>
                updateCharacter("level", Math.max(1, character.level - 1))
              }
              disabled={character.level <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="input input-bordered w-20 mx-2 text-center"
              value={character.level}
              onChange={(e) =>
                updateCharacter(
                  "level",
                  Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                )
              }
              min="1"
              max="20"
            />
            <button
              className="btn btn-sm btn-circle"
              onClick={() =>
                updateCharacter("level", Math.min(20, character.level + 1))
              }
              disabled={character.level >= 20}
            >
              +
            </button>
            <span className="ml-4">通常新角色从1级开始</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
