// steps/CompletionStep.tsx

import React from "react";
import { Character, calculateModifier } from "../types/character";

interface CompletionStepProps {
  character: Character;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ character }) => {
  // 计算生命值
  const calculateHP = (): number => {
    const conModifier = calculateModifier(character.stats.constitution);

    if (character.characterClass === "野蛮人 (Barbarian)") {
      return 12 + conModifier;
    } else if (
      character.characterClass === "战士 (Fighter)" ||
      character.characterClass === "圣武士 (Paladin)" ||
      character.characterClass === "游侠 (Ranger)"
    ) {
      return 10 + conModifier;
    } else if (
      character.characterClass === "术士 (Sorcerer)" ||
      character.characterClass === "法师 (Wizard)"
    ) {
      return 6 + conModifier;
    } else {
      return 8 + conModifier;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">角色创建完成</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">角色摘要</h3>
            <div className="bg-base-200 p-4 rounded-lg">
              <p>
                <strong>名称:</strong> {character.name}
              </p>
              <p>
                <strong>种族:</strong> {character.race}{" "}
                {character.subrace ? `(${character.subrace})` : ""}
              </p>
              <p>
                <strong>职业:</strong> {character.characterClass}
              </p>
              <p>
                <strong>等级:</strong> {character.level}
              </p>
              <p>
                <strong>背景:</strong> {character.background}
              </p>
              <p>
                <strong>阵营:</strong> {character.alignment}
              </p>

              <h4 className="font-bold mt-4 mb-2">属性值</h4>
              {Object.entries(character.stats).map(([stat, value]) => (
                <p key={stat}>
                  <strong className="capitalize">
                    {stat === "strength"
                      ? "力量: "
                      : stat === "dexterity"
                      ? "敏捷: "
                      : stat === "constitution"
                      ? "体质: "
                      : stat === "intelligence"
                      ? "智力: "
                      : stat === "wisdom"
                      ? "感知: "
                      : "魅力: "}
                  </strong>
                  {value} ({calculateModifier(value) >= 0 ? "+" : ""}
                  {calculateModifier(value)})
                </p>
              ))}

              <h4 className="font-bold mt-4 mb-2">技能熟练</h4>
              <div className="flex flex-wrap gap-1">
                {character.skillProficiencies.map((skill) => (
                  <span key={skill} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">角色数据</h3>
            <div className="stats stats-vertical bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title">生命值</div>
                <div className="stat-value text-primary">{calculateHP()}</div>
                <div className="stat-desc">基于职业和体质</div>
              </div>

              <div className="stat">
                <div className="stat-title">护甲等级</div>
                <div className="stat-value text-secondary">
                  {10 + calculateModifier(character.stats.dexterity)}
                </div>
                <div className="stat-desc">基础AC（无装备）</div>
              </div>

              <div className="stat">
                <div className="stat-title">先攻</div>
                <div className="stat-value">
                  {calculateModifier(character.stats.dexterity) >= 0 ? "+" : ""}
                  {calculateModifier(character.stats.dexterity)}
                </div>
                <div className="stat-desc">基于敏捷调整值</div>
              </div>

              <div className="stat">
                <div className="stat-title">熟练加值</div>
                <div className="stat-value">
                  +{2 + Math.floor((character.level - 1) / 4)}
                </div>
                <div className="stat-desc">基于角色等级</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">下一步</h3>
              <p className="mb-4">
                你的角色已经准备就绪！点击下方按钮保存你的角色并开始你的冒险，或者返回修改角色的任何部分。
              </p>
              <ul className="list-disc list-inside">
                <li>为你的角色选择适合的装备</li>
                <li>与游戏大师讨论你的角色背景</li>
                <li>考虑角色的个性特点和动机</li>
                <li>准备好你的角色卡，开始你的冒险吧！</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
