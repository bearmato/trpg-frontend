// steps/ClassSelectionStep.tsx

import React, { useState, useEffect } from "react";
import { Character, CLASSES } from "../types/character";

interface ClassSelectionStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const ClassSelectionStep: React.FC<ClassSelectionStepProps> = ({
  character,
  updateCharacter,
}) => {
  // 状态用于调试
  const [selectedClass, setSelectedClass] = useState<string>(
    character.characterClass || ""
  );
  const [error, setError] = useState<string | null>(null);

  // 当character.characterClass变化时更新本地状态
  useEffect(() => {
    setSelectedClass(character.characterClass || "");
  }, [character.characterClass]);

  // 处理职业选择变化
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);

    try {
      // 直接更新角色对象
      updateCharacter("characterClass", newClass);
      setError(null);
    } catch (err) {
      console.error("更新职业时出错:", err);
      setError(
        "更新职业失败: " + (err instanceof Error ? err.message : String(err))
      );
    }
  };

  // 获取职业描述
  const getClassDescription = (className: string): string => {
    switch (className) {
      case "战士 (Fighter)":
        return "战士是武器与技巧的大师，以卓越的战斗能力著称。他们熟练掌握多种武器和防具。";
      case "法师 (Wizard)":
        return "法师掌握强大的奥术魔法，通过研习获得施法能力。他们拥有丰富的法术书和学识。";
      case "游荡者 (Rogue)":
        return "游荡者以其隐秘和灵巧著称，擅长解除陷阱、开锁和偷窃。他们能造成额外的偷袭伤害。";
      case "牧师 (Cleric)":
        return "牧师是虔诚的信仰战士，从神祇处获得神圣魔法的能力。他们可以治愈伤口并惩罚敌人。";
      case "野蛮人 (Barbarian)":
        return "野蛮人是狂怒的战士，在战斗中释放原始的力量。他们拥有惊人的耐力和战斗本能。";
      case "吟游诗人 (Bard)":
        return "吟游诗人是多才多艺的表演者和法师，通过音乐和诗歌引导魔法。他们擅长激励盟友。";
      case "德鲁伊 (Druid)":
        return "德鲁伊是自然的守护者，拥有操控自然元素和变形为野兽的能力。他们与大自然有深厚联系。";
      case "武僧 (Monk)":
        return "武僧通过严格的修行掌握气的力量，将身体锻炼成武器。他们在徒手格斗中无人能敌。";
      case "圣武士 (Paladin)":
        return "圣武士是神圣战士，通过神圣誓言获得力量。他们能治愈盟友、驱散黑暗并惩罚邪恶。";
      case "游侠 (Ranger)":
        return "游侠是荒野中的专家猎人和追踪者。他们擅长远程战斗，并有对特定敌人的专门知识。";
      case "术士 (Sorcerer)":
        return "术士拥有与生俱来的魔法天赋，不需要像法师那样研习。他们的法术来源于血脉的力量。";
      case "邪术师 (Warlock)":
        return "邪术师与强大的异界存在达成契约，获得神秘的奥术能力。他们拥有独特的魔法表现形式。";
      default:
        return "选择一个职业来查看其特性和能力。";
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择职业</h2>

        {error && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">职业</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedClass}
                onChange={handleClassChange}
              >
                <option value="">选择职业</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* 调试信息 - 仅在开发环境显示 */}
            {import.meta.env.DEV && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
                <h3 className="font-bold mb-2">调试信息</h3>
                <p>本地状态: {selectedClass || "未选择"}</p>
                <p>角色状态: {character.characterClass || "未选择"}</p>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {selectedClass ? (
              <>
                <h3 className="font-bold text-lg">{selectedClass} 特性</h3>
                <p className="my-2">{getClassDescription(selectedClass)}</p>
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
