// steps/ClassSelectionStep.tsx

import React from "react";
import { Character, CLASSES } from "../types/character";

interface ClassSelectionStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const ClassSelectionStep: React.FC<ClassSelectionStepProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择职业</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">职业</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.characterClass}
                onChange={(e) =>
                  updateCharacter("characterClass", e.target.value)
                }
              >
                <option value="">选择职业</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {character.characterClass ? (
              <>
                <h3 className="font-bold text-lg">
                  {character.characterClass} 特性
                </h3>
                <p className="my-2">
                  {character.characterClass === "战士 (Fighter)"
                    ? "战士是武器与技巧的大师，以卓越的战斗能力著称。他们熟练掌握多种武器和防具。"
                    : character.characterClass === "法师 (Wizard)"
                    ? "法师掌握强大的奥术魔法，通过研习获得施法能力。他们拥有丰富的法术书和学识。"
                    : character.characterClass === "游荡者 (Rogue)"
                    ? "游荡者以其隐秘和灵巧著称，擅长解除陷阱、开锁和偷窃。他们能造成额外的偷袭伤害。"
                    : "查看职业详情获取该职业的特性描述。"}
                </p>
              </>
            ) : (
              <p className="text-gray-500 italic">选择一个职业查看其特性...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelectionStep;
