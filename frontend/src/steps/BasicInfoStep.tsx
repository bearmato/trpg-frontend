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
      </div>
    </div>
  );
};

export default BasicInfoStep;
