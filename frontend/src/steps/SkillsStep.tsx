// steps/SkillsStep.tsx

import React, { useState, useEffect } from "react";
import { SKILLS } from "../types/character";

interface SkillsStepProps {
  skillProficiencies: string[];
  toggleSkill: (skill: string) => void;
  characterClass: string;
  background: string;
}

const SkillsStep: React.FC<SkillsStepProps> = ({
  skillProficiencies,
  toggleSkill,
  characterClass,
  background,
}) => {
  // 存储职业和背景可选的技能
  const [classSkillOptions, setClassSkillOptions] = useState<string[]>([]);
  const [backgroundSkillOptions, setBackgroundSkillOptions] = useState<
    string[]
  >([]);

  // 职业允许选择的技能数量
  const [classSkillCount, setClassSkillCount] = useState(0);
  // 背景赋予的固定技能
  const [backgroundSkills, setBackgroundSkills] = useState<string[]>([]);

  // 计算已经选择的职业技能数量
  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>([]);

  // 当职业或背景变化时，更新可选技能
  useEffect(() => {
    // 重置已选技能状态
    setSelectedClassSkills([]);

    // 根据职业设置可选技能和可选择数量
    switch (characterClass) {
      case "战士 (Fighter)":
        setClassSkillOptions([
          "体操 (Acrobatics)",
          "驯兽 (Animal Handling)",
          "运动 (Athletics)",
          "历史 (History)",
          "洞悉 (Insight)",
          "威吓 (Intimidation)",
          "察觉 (Perception)",
          "求生 (Survival)",
        ]);
        setClassSkillCount(2);
        break;
      case "法师 (Wizard)":
        setClassSkillOptions([
          "奥秘 (Arcana)",
          "历史 (History)",
          "洞悉 (Insight)",
          "调查 (Investigation)",
          "医疗 (Medicine)",
          "宗教 (Religion)",
        ]);
        setClassSkillCount(2);
        break;
      case "游荡者 (Rogue)":
        setClassSkillOptions([
          "体操 (Acrobatics)",
          "运动 (Athletics)",
          "欺骗 (Deception)",
          "洞悉 (Insight)",
          "威吓 (Intimidation)",
          "调查 (Investigation)",
          "察觉 (Perception)",
          "表演 (Performance)",
          "说服 (Persuasion)",
          "巧手 (Sleight of Hand)",
          "隐匿 (Stealth)",
        ]);
        setClassSkillCount(4);
        break;
      case "牧师 (Cleric)":
        setClassSkillOptions([
          "历史 (History)",
          "洞悉 (Insight)",
          "医疗 (Medicine)",
          "说服 (Persuasion)",
          "宗教 (Religion)",
        ]);
        setClassSkillCount(2);
        break;
      case "野蛮人 (Barbarian)":
        setClassSkillOptions([
          "驯兽 (Animal Handling)",
          "运动 (Athletics)",
          "威吓 (Intimidation)",
          "自然 (Nature)",
          "察觉 (Perception)",
          "求生 (Survival)",
        ]);
        setClassSkillCount(2);
        break;
      default:
        setClassSkillOptions(SKILLS);
        setClassSkillCount(2);
    }

    // 设置背景提供的技能
    switch (background) {
      case "侍僧 (Acolyte)":
        setBackgroundSkills(["洞悉 (Insight)", "宗教 (Religion)"]);
        break;
      case "罪犯 (Criminal)":
        setBackgroundSkills(["欺骗 (Deception)", "隐匿 (Stealth)"]);
        break;
      case "民间英雄 (Folk Hero)":
        setBackgroundSkills(["驯兽 (Animal Handling)", "求生 (Survival)"]);
        break;
      case "贵族 (Noble)":
        setBackgroundSkills(["历史 (History)", "说服 (Persuasion)"]);
        break;
      case "贤者 (Sage)":
        setBackgroundSkills(["奥秘 (Arcana)", "历史 (History)"]);
        break;
      case "士兵 (Soldier)":
        setBackgroundSkills(["运动 (Athletics)", "威吓 (Intimidation)"]);
        break;
      case "流浪儿 (Urchin)":
        setBackgroundSkills(["巧手 (Sleight of Hand)", "隐匿 (Stealth)"]);
        break;
      default:
        setBackgroundSkills([]);
    }
  }, [characterClass, background]);

  // 当背景技能改变或技能选择改变时，更新已选职业技能
  useEffect(() => {
    // 过滤掉背景已经提供的技能，计算实际选择的职业技能
    const selectedClass = skillProficiencies.filter(
      (skill) => !backgroundSkills.includes(skill)
    );
    setSelectedClassSkills(selectedClass);
  }, [skillProficiencies, backgroundSkills]);

  // 处理技能选择
  const handleSkillToggle = (skill: string) => {
    // 如果是背景技能，不允许取消选择
    if (backgroundSkills.includes(skill)) {
      return;
    }

    // 如果技能已选择，可以取消
    if (skillProficiencies.includes(skill)) {
      toggleSkill(skill);
      return;
    }

    // 如果是职业技能且未达到上限，允许选择
    if (
      classSkillOptions.includes(skill) &&
      selectedClassSkills.length < classSkillCount
    ) {
      toggleSkill(skill);
    }
  };

  // 判断技能是否可选
  const isSkillSelectable = (skill: string) => {
    // 背景技能总是被选中且不可更改
    if (backgroundSkills.includes(skill)) {
      return false;
    }

    // 如果已经选择了这个技能，允许取消
    if (skillProficiencies.includes(skill)) {
      return true;
    }

    // 如果是职业技能且未达到上限，允许选择
    return (
      classSkillOptions.includes(skill) &&
      selectedClassSkills.length < classSkillCount
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择技能熟练</h2>

        <div className="max-w-3xl mx-auto">
          <p className="mb-2">
            基于你的职业和背景，选择你熟练的技能。
            {characterClass && (
              <span className="font-semibold">
                {" "}
                你的职业 {characterClass} 允许你从特定技能中选择{" "}
                {classSkillCount} 项技能。
              </span>
            )}
            {background && backgroundSkills.length > 0 && (
              <span className="font-semibold">
                {" "}
                你的背景 {background} 已经提供了 {backgroundSkills.join("、")}{" "}
                技能。
              </span>
            )}
          </p>

          <div className="flex mb-4 items-center">
            <div className="badge badge-primary mr-2">已选择</div>
            <span className="mr-4">{skillProficiencies.length} 项技能</span>
            <div className="badge badge-outline mr-2">职业技能</div>
            <span>
              {selectedClassSkills.length}/{classSkillCount}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {SKILLS.map((skill) => {
              const isFromBackground = backgroundSkills.includes(skill);
              const isSelected = skillProficiencies.includes(skill);
              const isDisabled = !isSkillSelectable(skill);

              return (
                <div key={skill} className="form-control">
                  <label
                    className={`label cursor-pointer justify-start gap-2 ${
                      isDisabled && !isSelected ? "opacity-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className={`checkbox ${
                        isFromBackground
                          ? "checkbox-secondary"
                          : "checkbox-primary"
                      }`}
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skill)}
                      disabled={isDisabled && !isSelected}
                    />
                    <span className="label-text">
                      {skill}
                      {isFromBackground && (
                        <span className="text-xs text-secondary"> (背景)</span>
                      )}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="bg-base-200 p-4 rounded-lg mt-6">
            <h3 className="font-bold text-lg">技能说明</h3>
            <p className="my-2">
              你的角色可以在各种情境下使用熟练的技能获得额外的加值。熟练的技能会添加你的熟练加值到相关检定中。
            </p>
            <p className="my-2">
              技能熟练通常由你的职业、背景和某些专长决定。每个职业允许你选择特定数量的技能，而你的背景则自动提供2项技能熟练。
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
                  <strong>魅力</strong>：欺骗、威吓、表演、说服
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
