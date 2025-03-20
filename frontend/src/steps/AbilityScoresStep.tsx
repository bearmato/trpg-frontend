// steps/AbilityScoresStep.tsx

import React from "react";
import { CharacterStats, calculateModifier } from "../types/character";

interface AbilityScoresStepProps {
  stats: CharacterStats;
  updateStat: (stat: keyof CharacterStats, value: number) => void;
}

const AbilityScoresStep: React.FC<AbilityScoresStepProps> = ({
  stats,
  updateStat,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">分配属性值</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {Object.entries(stats).map(([stat, value]) => (
              <div key={stat} className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-lg capitalize">
                    {stat === "strength"
                      ? "力量 (STR)"
                      : stat === "dexterity"
                      ? "敏捷 (DEX)"
                      : stat === "constitution"
                      ? "体质 (CON)"
                      : stat === "intelligence"
                      ? "智力 (INT)"
                      : stat === "wisdom"
                      ? "感知 (WIS)"
                      : "魅力 (CHA)"}
                  </span>
                </label>
                <div className="flex items-center">
                  <button
                    className="btn btn-sm btn-circle"
                    onClick={() =>
                      updateStat(stat as keyof CharacterStats, value - 1)
                    }
                    disabled={value <= 3}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="input input-bordered w-20 mx-2 text-center"
                    value={value}
                    onChange={(e) =>
                      updateStat(
                        stat as keyof CharacterStats,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <button
                    className="btn btn-sm btn-circle"
                    onClick={() =>
                      updateStat(stat as keyof CharacterStats, value + 1)
                    }
                    disabled={value >= 18}
                  >
                    +
                  </button>
                  <span className="ml-4">
                    调整值: {calculateModifier(value) >= 0 ? "+" : ""}
                    {calculateModifier(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold text-lg">属性说明</h3>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>力量 (STR)</strong>:
                决定角色的身体力量，影响近战攻击和伤害
              </li>
              <li>
                <strong>敏捷 (DEX)</strong>:
                决定角色的灵活性，影响远程攻击、先攻和AC
              </li>
              <li>
                <strong>体质 (CON)</strong>: 决定角色的耐力和健康，影响生命值
              </li>
              <li>
                <strong>智力 (INT)</strong>: 决定角色的学识和逻辑推理能力
              </li>
              <li>
                <strong>感知 (WIS)</strong>: 决定角色的直觉和洞察力
              </li>
              <li>
                <strong>魅力 (CHA)</strong>: 决定角色的个人魅力和社交能力
              </li>
            </ul>
            <p className="mt-4 text-sm">
              标准分配使用点数购买制：每个属性从8点开始，总共有27点可以分配。
            </p>

            <div className="mt-6 p-4 bg-base-300 rounded-lg">
              <h4 className="font-bold mb-2">种族属性加成</h4>
              <p className="text-sm">
                根据你的种族选择，某些属性可能会获得额外加值。这些加值会在最终角色中自动计算。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilityScoresStep;
