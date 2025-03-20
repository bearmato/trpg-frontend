// steps/AbilityScoresStep.tsx

import React, { useState, useEffect } from "react";
import { CharacterStats, calculateModifier } from "../types/character";

interface AbilityScoresStepProps {
  stats: CharacterStats;
  updateStat: (stat: keyof CharacterStats, value: number) => void;
  race: string;
  subrace: string;
}

const AbilityScoresStep: React.FC<AbilityScoresStepProps> = ({
  stats,
  updateStat,
  race,
  subrace,
}) => {
  // 种族加成
  const [racialBonuses, setRacialBonuses] = useState<Partial<CharacterStats>>(
    {}
  );

  // 点数购买系统的成本
  const pointCosts: Record<number, number> = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
  };

  // 最大和最小属性值限制
  const MIN_STAT = 8;
  const MAX_STAT = 15;
  const TOTAL_POINTS = 27;

  // 计算已使用的点数
  const calculateUsedPoints = () => {
    let points = 0;
    Object.entries(stats).forEach(([stat, value]) => {
      // 减去种族加成，得到基础值
      const baseValue =
        value - (racialBonuses[stat as keyof CharacterStats] || 0);
      // 计算点数成本
      points += pointCosts[baseValue] || 0;
    });
    return points;
  };

  const [usedPoints, setUsedPoints] = useState(calculateUsedPoints());

  // 更新种族加成
  useEffect(() => {
    let bonuses: Partial<CharacterStats> = {};

    switch (race) {
      case "人类 (Human)":
        // 标准人类所有属性+1
        bonuses = {
          strength: 1,
          dexterity: 1,
          constitution: 1,
          intelligence: 1,
          wisdom: 1,
          charisma: 1,
        };
        break;
      case "精灵 (Elf)":
        // 基础精灵敏捷+2
        bonuses = { dexterity: 2 };

        // 精灵亚种
        if (subrace === "高等精灵") {
          bonuses.intelligence = 1;
        } else if (subrace === "木精灵") {
          bonuses.wisdom = 1;
        } else if (subrace === "黑暗精灵") {
          bonuses.charisma = 1;
        }
        break;
      case "矮人 (Dwarf)":
        // 基础矮人体质+2
        bonuses = { constitution: 2 };

        // 矮人亚种
        if (subrace === "山地矮人") {
          bonuses.strength = 2;
        } else if (subrace === "丘陵矮人") {
          bonuses.wisdom = 1;
        }
        break;
      case "半身人 (Halfling)":
        // 基础半身人敏捷+2
        bonuses = { dexterity: 2 };

        // 半身人亚种
        if (subrace === "轻足半身人") {
          bonuses.charisma = 1;
        } else if (subrace === "强魄半身人") {
          bonuses.constitution = 1;
        }
        break;
      // 可以继续添加其他种族
      case "半精灵 (Half-Elf)":
        // 半精灵魅力+2，以及两项其他属性+1
        bonuses = { charisma: 2 };
        break;
      case "半兽人 (Half-Orc)":
        // 半兽人力量+2，体质+1
        bonuses = { strength: 2, constitution: 1 };
        break;
      // ... 其他种族
    }

    setRacialBonuses(bonuses);
  }, [race, subrace]);

  // 当属性值变化时，重新计算已使用点数
  useEffect(() => {
    setUsedPoints(calculateUsedPoints());
  }, [stats, racialBonuses]);

  // 增加属性值
  const increaseStat = (stat: keyof CharacterStats) => {
    const baseValue = stats[stat] - (racialBonuses[stat] || 0);
    const newBaseValue = baseValue + 1;

    // 检查是否超出上限或点数不足
    if (newBaseValue > MAX_STAT) return;

    // 计算增加这个属性需要额外花费的点数
    const currentCost = pointCosts[baseValue] || 0;
    const newCost = pointCosts[newBaseValue] || 0;
    const additionalPoints = newCost - currentCost;

    // 检查是否有足够的点数
    if (usedPoints + additionalPoints > TOTAL_POINTS) return;

    // 更新属性值（包括种族加成）
    updateStat(stat, newBaseValue + (racialBonuses[stat] || 0));
  };

  // 减少属性值
  const decreaseStat = (stat: keyof CharacterStats) => {
    const baseValue = stats[stat] - (racialBonuses[stat] || 0);
    const newBaseValue = baseValue - 1;

    // 检查是否低于下限
    if (newBaseValue < MIN_STAT) return;

    // 更新属性值（包括种族加成）
    updateStat(stat, newBaseValue + (racialBonuses[stat] || 0));
  };

  // 获取属性的基础值（不包括种族加成）
  const getBaseValue = (stat: keyof CharacterStats) => {
    return stats[stat] - (racialBonuses[stat] || 0);
  };

  // 获取特定属性值的点数成本
  const getPointCost = (value: number) => {
    return pointCosts[value] || 0;
  };

  // 格式化属性名称
  const formatStatName = (stat: string) => {
    switch (stat) {
      case "strength":
        return "力量 (STR)";
      case "dexterity":
        return "敏捷 (DEX)";
      case "constitution":
        return "体质 (CON)";
      case "intelligence":
        return "智力 (INT)";
      case "wisdom":
        return "感知 (WIS)";
      case "charisma":
        return "魅力 (CHA)";
      default:
        return stat;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">分配属性值</h2>

        <div className="bg-amber-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">点数购买系统</h3>
            <div className="text-right">
              <span className="font-bold">
                已用点数: {usedPoints}/{TOTAL_POINTS}
              </span>
              <div className="text-xs mt-1">
                可用点数: {TOTAL_POINTS - usedPoints}
              </div>
            </div>
          </div>
          <p className="text-sm mt-2">
            从基础值8开始，使用点数提高属性。各属性最低为8，最高为15（种族加成前）。
            点数成本：8(0), 9(1), 10(2), 11(3), 12(4), 13(5), 14(7), 15(9)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {Object.entries(stats).map(([stat, value]) => {
              const typedStat = stat as keyof CharacterStats;
              const baseValue = getBaseValue(typedStat);
              const racialBonus = racialBonuses[typedStat] || 0;
              const pointCost = getPointCost(baseValue);

              return (
                <div key={stat} className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-lg capitalize">
                      {formatStatName(stat)}
                    </span>
                    <span className="label-text-alt">成本: {pointCost} 点</span>
                  </label>
                  <div className="flex items-center">
                    <button
                      className="btn btn-sm btn-circle"
                      onClick={() => decreaseStat(typedStat)}
                      disabled={baseValue <= MIN_STAT}
                    >
                      -
                    </button>
                    <div className="flex flex-col items-center mx-4 w-12">
                      <span className="text-xl font-bold">{value}</span>
                      <div className="text-xs flex items-center gap-1">
                        <span>{baseValue}</span>
                        {racialBonus > 0 && (
                          <span className="text-green-600">+{racialBonus}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-circle"
                      onClick={() => increaseStat(typedStat)}
                      disabled={
                        baseValue >= MAX_STAT ||
                        usedPoints + (getPointCost(baseValue + 1) - pointCost) >
                          TOTAL_POINTS
                      }
                    >
                      +
                    </button>
                    <span className="ml-4">
                      调整值: {calculateModifier(value) >= 0 ? "+" : ""}
                      {calculateModifier(value)}
                    </span>
                  </div>
                </div>
              );
            })}
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

            <div className="mt-6 p-4 bg-base-300 rounded-lg">
              <h4 className="font-bold mb-2">种族属性加成</h4>
              {Object.keys(racialBonuses).length > 0 ? (
                <ul className="text-sm space-y-1">
                  {Object.entries(racialBonuses).map(([stat, bonus]) => (
                    <li key={stat}>
                      {formatStatName(stat)}: +{bonus}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic">请选择一个种族来查看属性加成</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilityScoresStep;
