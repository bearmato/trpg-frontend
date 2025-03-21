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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Portrait - First Column */}
          <div className="flex flex-col items-center">
            {character.portraitUrl ? (
              <img
                src={character.portraitUrl}
                alt={`${character.name}的立绘`}
                className="max-w-full rounded-lg shadow-lg border-2 border-primary max-h-96 object-contain mb-4"
              />
            ) : (
              <div className="bg-base-200 p-8 rounded-lg text-center w-full h-80 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 opacity-30">🧙</div>
                <p className="text-base-content/70">未生成角色立绘</p>
              </div>
            )}

            <div className="stats shadow mt-4 w-full">
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
            </div>

            <div className="stats shadow mt-2 w-full">
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
          </div>

          {/* Character Stats and Skills - Second Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">角色摘要</h3>
            <div className="bg-base-200 p-4 rounded-lg shadow-sm">
              <p className="text-lg font-bold mb-2">
                {character.name || "无名角色"}
              </p>
              <p>
                <span className="font-semibold">等级:</span> {character.level}{" "}
                {character.characterClass}
              </p>
              <p>
                <span className="font-semibold">种族:</span> {character.race}{" "}
                {character.subrace ? `(${character.subrace})` : ""}
              </p>
              <p>
                <span className="font-semibold">背景:</span>{" "}
                {character.background}
              </p>
              <p>
                <span className="font-semibold">阵营:</span>{" "}
                {character.alignment}
              </p>
              <p>
                <span className="font-semibold">性别:</span>{" "}
                {character.gender === "male"
                  ? "男性"
                  : character.gender === "female"
                  ? "女性"
                  : character.gender === "non-binary"
                  ? "非二元性别"
                  : "未指定"}
              </p>

              <div className="divider my-2"></div>

              <h4 className="font-bold mt-2 mb-2">属性值</h4>
              <div className="grid grid-cols-2 gap-2">
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
              </div>

              <h4 className="font-bold mt-4 mb-2">技能熟练</h4>
              <div className="flex flex-wrap gap-1">
                {character.skillProficiencies.length > 0 ? (
                  character.skillProficiencies.map((skill) => (
                    <span key={skill} className="badge badge-primary">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-base-content/70">
                    未选择技能熟练
                  </span>
                )}
              </div>

              {character.features && character.features.length > 0 && (
                <>
                  <h4 className="font-bold mt-4 mb-2">外貌特征</h4>
                  <div className="flex flex-wrap gap-1">
                    {character.features.map((feature) => (
                      <span key={feature} className="badge badge-secondary">
                        {feature}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Background Story - Third Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">角色背景</h3>
            {character.backgroundStory ? (
              <div className="bg-base-200 p-4 rounded-lg shadow-sm prose">
                {character.backgroundStory
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
              </div>
            ) : (
              <div className="bg-base-200 p-4 rounded-lg shadow-sm text-base-content/70">
                <p>未生成角色背景故事</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">下一步</h3>
              <div className="bg-base-200 p-4 rounded-lg shadow-sm">
                <p className="mb-4">
                  你的角色已经准备就绪！点击下方按钮保存你的角色并开始你的冒险，或者返回修改角色的任何部分。
                </p>
                <ul className="list-disc list-inside space-y-1">
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
    </div>
  );
};

export default CompletionStep;
