// steps/AbilityScoresStep.tsx

import React, { useState, useEffect } from "react";
import { CharacterStats, calculateModifier } from "../types/character";

interface AbilityScoresStepProps {
  stats: CharacterStats;
  updateStat: (stat: keyof CharacterStats, value: number) => void;
  updateStats: (newStats: CharacterStats) => void;
  race: string;
  subrace: string;
}

const AbilityScoresStep: React.FC<AbilityScoresStepProps> = ({
  stats,
  updateStat,
  updateStats,
  race,
  subrace,
}) => {
  // 属性生成方法
  const [generationMethod, setGenerationMethod] = useState<string>("pointBuy");

  // 标准数组值
  const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

  // 跟踪标准数组已分配值
  const [assignedValues, setAssignedValues] = useState<{
    [key: string]: number | null;
  }>({
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
  });

  // 跟踪掷骰结果
  const [rolledValues, setRolledValues] = useState<number[]>([]);

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
      case "Human":
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
      case "Elf":
        // 基础精灵敏捷+2
        bonuses = { dexterity: 2 };

        // 精灵亚种
        if (subrace === "High Elf") {
          bonuses.intelligence = 1;
        } else if (subrace === "Wood Elf") {
          bonuses.wisdom = 1;
        } else if (subrace === "Dark Elf") {
          bonuses.charisma = 1;
        }
        break;
      case "Dwarf":
        // 基础矮人体质+2
        bonuses = { constitution: 2 };

        // 矮人亚种
        if (subrace === "Mountain Dwarf") {
          bonuses.strength = 2;
        } else if (subrace === "Hill Dwarf") {
          bonuses.wisdom = 1;
        }
        break;
      case "Halfling":
        // 基础半身人敏捷+2
        bonuses = { dexterity: 2 };

        // 半身人亚种
        if (subrace === "Lightfoot Halfling") {
          bonuses.charisma = 1;
        } else if (subrace === "Stout Halfling") {
          bonuses.constitution = 1;
        }
        break;
      case "Half-Elf":
        // 半精灵魅力+2，以及两项其他属性+1
        bonuses = { charisma: 2 };
        break;
      case "Half-Orc":
        // 半兽人力量+2，体质+1
        bonuses = { strength: 2, constitution: 1 };
        break;
      case "Gnome":
        // 侏儒智力+2
        bonuses = { intelligence: 2 };
        if (subrace === "Forest Gnome") {
          bonuses.dexterity = 1;
        } else if (subrace === "Rock Gnome") {
          bonuses.constitution = 1;
        }
        break;
      case "Tiefling":
        // 提夫林魅力+2，智力+1
        bonuses = { charisma: 2, intelligence: 1 };
        break;
      case "Dragonborn":
        // 龙裔力量+2，魅力+1
        bonuses = { strength: 2, charisma: 1 };
        break;
    }

    setRacialBonuses(bonuses);
  }, [race, subrace]);

  // 当属性值变化时，重新计算已使用点数
  useEffect(() => {
    if (generationMethod === "pointBuy") {
      setUsedPoints(calculateUsedPoints());
    }
  }, [stats, racialBonuses, generationMethod]);

  // 增加属性值
  const increaseStat = (stat: keyof CharacterStats) => {
    if (generationMethod !== "pointBuy") return;

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
    if (generationMethod !== "pointBuy") return;

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
        return "Strength (STR)";
      case "dexterity":
        return "Dexterity (DEX)";
      case "constitution":
        return "Constitution (CON)";
      case "intelligence":
        return "Intelligence (INT)";
      case "wisdom":
        return "Wisdom (WIS)";
      case "charisma":
        return "Charisma (CHA)";
      default:
        return stat;
    }
  };

  // 切换属性生成方法
  const changeGenerationMethod = (method: string) => {
    setGenerationMethod(method);

    // 重置属性值
    let newStats = { ...stats };

    if (method === "pointBuy") {
      // 点数购买法：所有属性设为初始值8
      Object.keys(newStats).forEach((stat) => {
        const typedStat = stat as keyof CharacterStats;
        newStats[typedStat] = 8 + (racialBonuses[typedStat] || 0);
      });
    } else if (method === "standardArray") {
      // 标准数组法：重置标准数组分配状态
      setAssignedValues({
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null,
      });
      // 初始值设为8
      Object.keys(newStats).forEach((stat) => {
        const typedStat = stat as keyof CharacterStats;
        newStats[typedStat] = 8 + (racialBonuses[typedStat] || 0);
      });
    } else if (method === "rolling") {
      // 掷骰法：生成6组4d6取3最高值的结果
      rollStats();
    }

    updateStats(newStats);
  };

  // 为标准数组分配值
  const assignStandardValue = (
    stat: keyof CharacterStats,
    valueIndex: number
  ) => {
    // 检查该值是否已被分配
    const isValueAssigned = Object.values(assignedValues).includes(valueIndex);
    if (isValueAssigned && assignedValues[stat] !== valueIndex) return;

    // 更新分配状态
    const newAssignedValues = { ...assignedValues };

    // 如果该属性已经分配了值，清除之前的分配
    if (newAssignedValues[stat] !== null) {
      newAssignedValues[stat] = null;
    }

    // 分配新值
    newAssignedValues[stat] = valueIndex;
    setAssignedValues(newAssignedValues);

    // 更新属性值
    const newValue = STANDARD_ARRAY[valueIndex] + (racialBonuses[stat] || 0);
    updateStat(stat, newValue);
  };

  // 掷骰生成属性值
  const rollStats = () => {
    const rolls: number[] = [];

    // 生成6组值
    for (let i = 0; i < 6; i++) {
      // 模拟4d6取3高
      const dice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];

      // 排序并取最高的3个值
      dice.sort((a, b) => b - a);
      const sum = dice[0] + dice[1] + dice[2];
      rolls.push(sum);
    }

    // 按从高到低排序
    rolls.sort((a, b) => b - a);
    setRolledValues(rolls);

    // 重置已分配值
    setAssignedValues({
      strength: null,
      dexterity: null,
      constitution: null,
      intelligence: null,
      wisdom: null,
      charisma: null,
    });

    // 重置属性值
    let newStats = { ...stats };
    Object.keys(newStats).forEach((stat) => {
      const typedStat = stat as keyof CharacterStats;
      newStats[typedStat] = 8 + (racialBonuses[typedStat] || 0);
    });
    updateStats(newStats);
  };

  // 分配掷骰值
  const assignRolledValue = (
    stat: keyof CharacterStats,
    valueIndex: number
  ) => {
    // 检查该值是否已被分配
    const isValueAssigned = Object.values(assignedValues).includes(valueIndex);
    if (isValueAssigned && assignedValues[stat] !== valueIndex) return;

    // 更新分配状态
    const newAssignedValues = { ...assignedValues };

    // 如果该属性已经分配了值，清除之前的分配
    if (newAssignedValues[stat] !== null) {
      newAssignedValues[stat] = null;
    }

    // 分配新值
    newAssignedValues[stat] = valueIndex;
    setAssignedValues(newAssignedValues);

    // 更新属性值
    const newValue = rolledValues[valueIndex] + (racialBonuses[stat] || 0);
    updateStat(stat, newValue);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Ability Scores</h2>

        {/* 属性生成方法选择 */}
        <div className="tabs tabs-boxed mb-6">
          <a
            className={`tab ${
              generationMethod === "pointBuy" ? "tab-active" : ""
            }`}
            onClick={() => changeGenerationMethod("pointBuy")}
          >
            pointBuy
          </a>
          <a
            className={`tab ${
              generationMethod === "standardArray" ? "tab-active" : ""
            }`}
            onClick={() => changeGenerationMethod("standardArray")}
          >
            standardArray
          </a>
          <a
            className={`tab ${
              generationMethod === "rolling" ? "tab-active" : ""
            }`}
            onClick={() => changeGenerationMethod("rolling")}
          >
            rolling
          </a>
        </div>

        {/* 点数购买说明 */}
        {generationMethod === "pointBuy" && (
          <div className="bg-amber-100 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">pointBuy system</h3>
              <div className="text-right">
                <span className="font-bold">
                  Points Used: {usedPoints}/{TOTAL_POINTS}
                </span>
                <div className="text-xs mt-1">
                  Available Points: {TOTAL_POINTS - usedPoints}
                </div>
              </div>
            </div>
            <p className="text-sm mt-2">
              Start from base value 8, use points to increase attributes. Each
              attribute has a minimum of 8 and maximum of 15 (before racial
              bonuses). Point costs: 8(0), 9(1), 10(2), 11(3), 12(4), 13(5),
              14(7), 15(9)
            </p>
          </div>
        )}

        {/* 标准数组说明 */}
        {generationMethod === "standardArray" && (
          <div className="bg-amber-100 p-4 rounded-lg mb-6">
            <h3 className="font-bold">标准数组</h3>
            <p className="text-sm mt-2">
              使用预设的六个数值来分配你的属性：15, 14, 13, 12, 10,
              8。每个数值只能使用一次。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {STANDARD_ARRAY.map((value, index) => {
                const isAssigned =
                  Object.values(assignedValues).includes(index);
                return (
                  <div
                    key={index}
                    className={`badge ${
                      isAssigned ? "badge-primary" : "badge-outline"
                    } badge-lg`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 掷骰法说明 */}
        {generationMethod === "rolling" && (
          <div className="bg-amber-100 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Rolling Method (4d6 drop lowest)</h3>
              <button className="btn btn-sm" onClick={rollStats}>
                Roll Again
              </button>
            </div>
            <p className="text-sm mt-2">
              Roll 4 six-sided dice for each attribute, take the sum of the
              highest 3 values. Results are sorted from highest to lowest.
            </p>
            {rolledValues.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {rolledValues.map((value, index) => {
                  const isAssigned =
                    Object.values(assignedValues).includes(index);
                  return (
                    <div
                      key={index}
                      className={`badge ${
                        isAssigned ? "badge-primary" : "badge-outline"
                      } badge-lg`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
                    {generationMethod === "pointBuy" && (
                      <span className="label-text-alt">
                        Cost: {pointCost} points
                      </span>
                    )}
                  </label>

                  {/* 点数购买界面 */}
                  {generationMethod === "pointBuy" && (
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
                            <span className="text-green-600">
                              +{racialBonus}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-circle"
                        onClick={() => increaseStat(typedStat)}
                        disabled={
                          baseValue >= MAX_STAT ||
                          usedPoints +
                            (getPointCost(baseValue + 1) - pointCost) >
                            TOTAL_POINTS
                        }
                      >
                        +
                      </button>
                      <span className="ml-4">
                        Modifier: {calculateModifier(value) >= 0 ? "+" : ""}
                        {calculateModifier(value)}
                      </span>
                    </div>
                  )}

                  {/* 标准数组界面 */}
                  {generationMethod === "standardArray" && (
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="flex flex-col items-center mr-4 w-12">
                          <span className="text-xl font-bold">{value}</span>
                          <div className="text-xs flex items-center gap-1">
                            {assignedValues[typedStat] !== null && (
                              <>
                                <span>
                                  {
                                    STANDARD_ARRAY[
                                      assignedValues[typedStat] as number
                                    ]
                                  }
                                </span>
                                {racialBonus > 0 && (
                                  <span className="text-green-600">
                                    +{racialBonus}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <span className="ml-4">
                          Modifier: {calculateModifier(value) >= 0 ? "+" : ""}
                          {calculateModifier(value)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {STANDARD_ARRAY.map((arrayValue, index) => {
                          const isSelectedForThis =
                            assignedValues[typedStat] === index;
                          const isAssignedElsewhere = Object.entries(
                            assignedValues
                          ).some(([key, val]) => val === index && key !== stat);

                          return (
                            <button
                              key={index}
                              className={`btn btn-sm ${
                                isSelectedForThis
                                  ? "btn-primary"
                                  : isAssignedElsewhere
                                  ? "btn-disabled opacity-50"
                                  : "btn-outline"
                              }`}
                              onClick={() =>
                                assignStandardValue(typedStat, index)
                              }
                              disabled={isAssignedElsewhere}
                            >
                              {arrayValue}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 掷骰法界面 */}
                  {generationMethod === "rolling" &&
                    rolledValues.length > 0 && (
                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <div className="flex flex-col items-center mr-4 w-12">
                            <span className="text-xl font-bold">{value}</span>
                            <div className="text-xs flex items-center gap-1">
                              {assignedValues[typedStat] !== null && (
                                <>
                                  <span>
                                    {
                                      rolledValues[
                                        assignedValues[typedStat] as number
                                      ]
                                    }
                                  </span>
                                  {racialBonus > 0 && (
                                    <span className="text-green-600">
                                      +{racialBonus}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <span className="ml-4">
                            Modifier: {calculateModifier(value) >= 0 ? "+" : ""}
                            {calculateModifier(value)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {rolledValues.map((rolledValue, index) => {
                            const isSelectedForThis =
                              assignedValues[typedStat] === index;
                            const isAssignedElsewhere = Object.entries(
                              assignedValues
                            ).some(
                              ([key, val]) => val === index && key !== stat
                            );

                            return (
                              <button
                                key={index}
                                className={`btn btn-sm ${
                                  isSelectedForThis
                                    ? "btn-primary"
                                    : isAssignedElsewhere
                                    ? "btn-disabled opacity-50"
                                    : "btn-outline"
                                }`}
                                onClick={() =>
                                  assignRolledValue(typedStat, index)
                                }
                                disabled={isAssignedElsewhere}
                              >
                                {rolledValue}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold text-lg">Attribute Descriptions</h3>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Strength (STR)</strong>: Determines physical power,
                affects melee attacks and damage
              </li>
              <li>
                <strong>Dexterity (DEX)</strong>: Determines agility, affects
                ranged attacks, initiative, and AC
              </li>
              <li>
                <strong>Constitution (CON)</strong>: Determines endurance and
                health, affects hit points
              </li>
              <li>
                <strong>Intelligence (INT)</strong>: Determines knowledge and
                logical reasoning ability
              </li>
              <li>
                <strong>Wisdom (WIS)</strong>: Determines intuition and insight
              </li>
              <li>
                <strong>Charisma (CHA)</strong>: Determines personal charm and
                social ability
              </li>
            </ul>

            <div className="mt-6 p-4 bg-base-300 rounded-lg">
              <h4 className="font-bold mb-2">Racial Attribute Bonuses</h4>
              {Object.keys(racialBonuses).length > 0 ? (
                <ul className="text-sm space-y-1">
                  {Object.entries(racialBonuses).map(([stat, bonus]) => (
                    <li key={stat}>
                      {formatStatName(stat)}: +{bonus}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic">
                  Select a race to view attribute bonuses
                </p>
              )}
            </div>

            <div className="mt-6 p-4 bg-base-300 rounded-lg">
              <h4 className="font-bold mb-2">Attribute Generation Methods</h4>
              <ul className="text-sm space-y-3">
                <li>
                  <strong>Point Buy</strong>: The most commonly used official
                  method. You have 27 points to increase attributes, with
                  different costs for different values.
                </li>
                <li>
                  <strong>Standard Array</strong>: Use predefined values
                  (15,14,13,12,10,8) for your six attributes, no point
                  calculation needed.
                </li>
                <li>
                  <strong>Rolling</strong>: Traditional DnD method. Roll 4d6 and
                  take the sum of the highest 3 values for each attribute, more
                  random.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilityScoresStep;
