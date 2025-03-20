// steps/RaceSelectionStep.tsx

import React from "react";
import { Character, RACES, SUBRACES } from "../types/character";

interface RaceSelectionStepProps {
  character: Character;
  handleRaceChange: (race: string) => void;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const RaceSelectionStep: React.FC<RaceSelectionStepProps> = ({
  character,
  handleRaceChange,
  updateCharacter,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择种族</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">种族</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.race}
                onChange={(e) => handleRaceChange(e.target.value)}
              >
                <option value="">选择种族</option>
                {RACES.map((race) => (
                  <option key={race} value={race}>
                    {race}
                  </option>
                ))}
              </select>
            </div>

            {character.race && SUBRACES[character.race]?.length > 0 && (
              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text text-lg">亚种</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={character.subrace}
                  onChange={(e) => updateCharacter("subrace", e.target.value)}
                >
                  {SUBRACES[character.race].map((subrace) => (
                    <option key={subrace} value={subrace}>
                      {subrace}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {character.race ? (
              <>
                <h3 className="font-bold text-lg">{character.race} 特性</h3>
                <p className="my-2">
                  {character.race === "人类 (Human)"
                    ? "作为人类，你所有属性值增加1。你也能熟练掌握一项额外的技能和一项专长。"
                    : character.race === "精灵 (Elf)"
                    ? "精灵有敏锐的感官、卓越的敏捷和优雅的姿态。他们拥有黑暗视觉和魔法抗性。"
                    : character.race === "矮人 (Dwarf)"
                    ? "矮人身体结实、忍耐力强，体质值增加2。他们拥有黑暗视觉和对毒素的抗性。"
                    : "查看种族详情获取该种族的特性描述。"}
                </p>
              </>
            ) : (
              <p className="text-gray-500 italic">选择一个种族查看其特性...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceSelectionStep;
