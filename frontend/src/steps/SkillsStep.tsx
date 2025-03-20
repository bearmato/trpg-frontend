// steps/SkillsStep.tsx

import React from "react";
import { SKILLS } from "../types/character";

interface SkillsStepProps {
  skillProficiencies: string[];
  toggleSkill: (skill: string) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({
  skillProficiencies,
  toggleSkill,
}) => {
  // 每个职业推荐的技能
  const getRecommendedSkills = (characterClass: string): string[] => {
    switch (characterClass) {
      case "战士 (Fighter)":
        return [
          "运动 (Athletics)",
          "洞悉 (Insight)",
          "威吓 (Intimidation)",
          "察觉 (Perception)",
        ];
      case "法师 (Wizard)":
        return [
          "奥秘 (Arcana)",
          "历史 (History)",
          "洞悉 (Insight)",
          "调查 (Investigation)",
        ];
      case "游荡者 (Rogue)":
        return [
          "体操 (Acrobatics)",
          "欺瞒 (Deception)",
          "隐匿 (Stealth)",
          "巧手 (Sleight of Hand)",
        ];
      default:
        return [];
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择技能熟练</h2>

        <div className="max-w-3xl mx-auto">
          <p className="mb-2">基于你的职业和背景，选择你熟练的技能。</p>
          <div className="flex mb-4 items-center">
            <div className="badge badge-primary mr-2">已选择</div>
            <span className="mr-4">{skillProficiencies.length} 项技能</span>
            <div className="badge badge-outline mr-2">至少选择</div>
            <span>2 项技能</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {SKILLS.map((skill) => (
              <div key={skill} className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={skillProficiencies.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  <span className="label-text">{skill}</span>
                </label>
              </div>
            ))}
          </div>

          <div className="bg-base-200 p-4 rounded-lg mt-6">
            <h3 className="font-bold text-lg">技能说明</h3>
            <p className="my-2">
              你的角色可以在各种情境下使用熟练的技能获得额外的加值。熟练的技能会添加你的熟练加值到相关检定中。
            </p>
            <p className="my-2">
              技能熟练通常由你的职业、背景和某些专长决定。选择能够反映你角色背景故事和生活经历的技能。
            </p>

            <div className="mt-4">
              <h4 className="font-semibold">关键属性对应的技能：</h4>
              <ul className="list-disc list-inside mt-2">
                <li>
                  <strong>力量</strong>：运动
                </li>
                <li>
                  <strong>敏捷</strong>：体操、巧手、隐匿
                </li>
                <li>
                  <strong>智力</strong>：奥秘、历史、调查、自然、宗教
                </li>
                <li>
                  <strong>感知</strong>：驯兽、洞悉、医疗、察觉、求生
                </li>
                <li>
                  <strong>魅力</strong>：欺瞒、威吓、表演、说服
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;
