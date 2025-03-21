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
  // 获取种族描述
  const getRaceDescription = (race: string): string => {
    switch (race) {
      case "人类 (Human)":
        return "人类是最为常见且适应力极强的种族，寿命较短但野心勃勃。他们在各种环境和社会中都能找到自己的位置，是天生的适应者和创新者。在游戏中，人类所有属性都+1，使他们成为任何职业的良好选择。";
      case "精灵 (Elf)":
        return "精灵是优雅、长寿的种族，与自然和魔法有着深厚的联系。他们生性优雅，反应敏捷，拥有敏锐的感官和卓越的敏捷性。精灵拥有黑暗视觉，敏捷+2，并且对魅惑魔法有抗性，同时不需要睡眠，只需冥想4小时。";
      case "矮人 (Dwarf)":
        return "矮人是坚韧、固执的地下种族，以工艺和战斗技巧闻名。他们体格强健，耐力惊人，对毒素和某些魔法有天生的抵抗力。矮人拥有黑暗视觉，体质+2，对毒素有抗性，熟练使用特定武器，并可以在石制环境中辨识特殊特征。";
      case "半身人 (Halfling)":
        return "半身人是矮小但勇敢的种族，以敏捷和幸运著称。他们性格友善，适应力强，有着惊人的运气和勇气。半身人的敏捷+2，能够通过较大生物的空间，可以重骰1点的d20检定，并且在对抗恐惧效果时有优势。";
      case "侏儒 (Gnome)":
        return "侏儒是小型种族，以智慧、创造力和对魔法的亲和力著称。他们天性好奇，热爱发明和探索。侏儒拥有黑暗视觉，智力+2，对某些魔法豁免有优势，并且能够与小型动物进行简单交流。";
      case "半精灵 (Half-Elf)":
        return "半精灵融合了人类和精灵的特质，既有精灵的优雅又有人类的适应力。他们往往在不同文化间找到自己的位置，是出色的外交官和协调者。半精灵拥有黑暗视觉，魅力+2，另外两项自选属性各+1，对魅惑有抗性，并获得两项额外技能熟练。";
      case "半兽人 (Half-Orc)":
        return "半兽人继承了人类的适应性和兽人的力量，是天生的战士。他们身体强健，意志坚定，在困境中展现惊人的韧性。半兽人拥有黑暗视觉，力量+2，体质+1，威吓技能熟练，当受到重击时可以额外造成一次攻击，且在生命值降至0时有机会保持1点生命值继续战斗。";
      case "提夫林 (Tiefling)":
        return "提夫林有着恶魔血统，既有超凡魅力又常遭受偏见。他们智慧过人，有着与生俱来的奥术才能。提夫林拥有黑暗视觉，智力+1，魅力+2，对火焰伤害具有抗性，并且能够使用一些天生的法术能力。";
      case "龙裔 (Dragonborn)":
        return "龙裔拥有龙的血脉，体格强健，具有呼吸武器和天生的骄傲。他们看重家族和传统，是天生的领导者。龙裔的力量+2，魅力+1，拥有基于血脉类型的伤害抗性，以及相应的吐息武器能力，可以造成范围伤害。";
      default:
        return "选择一个种族来查看其描述和能力。";
    }
  };

  // 获取亚种描述
  const getSubraceDescription = (race: string, subrace: string): string => {
    if (race === "人类 (Human)") {
      if (subrace === "标准") {
        return "标准人类的所有六项属性值各+1，这使他们成为极其平衡的选择，适合几乎任何职业。";
      } else if (subrace === "变体") {
        return "变体人类可以选择两项属性各+1，获得一项技能熟练和一个专长，提供更多的定制化选择。需要DM允许才能使用。";
      }
    } else if (race === "精灵 (Elf)") {
      if (subrace === "高等精灵") {
        return "高等精灵专注于魔法研究，智力+1，会一门额外语言，并获得一个法师戏法。适合法师和其他施法者职业。";
      } else if (subrace === "木精灵") {
        return "木精灵与自然紧密相连，感知+1，移动速度提高5英尺，并可在轻度遮蔽环境中尝试隐藏。非常适合游侠和德鲁伊。";
      } else if (subrace === "黑暗精灵") {
        return "黑暗精灵(卓尔)来自幽暗地域，魅力+1，拥有高级黑暗视觉和额外法术能力，但阳光下有劣势。使用需DM允许。";
      }
    } else if (race === "矮人 (Dwarf)") {
      if (subrace === "丘陵矮人") {
        return "丘陵矮人更加顽强，感知+1，最大生命值提高1点，并且每次升级额外获得1点生命值。适合牧师和德鲁伊职业。";
      } else if (subrace === "山地矮人") {
        return "山地矮人是出色的战士，力量+2，获得轻甲和中甲熟练。是战士、圣武士等近战职业的极佳选择。";
      }
    } else if (race === "半身人 (Halfling)") {
      if (subrace === "轻足半身人") {
        return "轻足半身人更具敏捷性，魅力+1，可以通过、穿过和停留在比自己大一号生物的空间中。适合游荡者和吟游诗人。";
      } else if (subrace === "强魄半身人") {
        return "强魄半身人更加坚韧，体质+1，对毒素有抗性，并且对毒素豁免有优势。适合需要生存能力的各类角色。";
      }
    } else if (race === "侏儒 (Gnome)") {
      if (subrace === "森林侏儒") {
        return "森林侏儒具有自然魔法天赋，敏捷+1，会一个简单幻术戏法，并能与小型野兽交流。适合德鲁伊和吟游诗人。";
      } else if (subrace === "岩石侏儒") {
        return "岩石侏儒精通发明和手工艺，体质+1，具有石工工艺知识，并能制作小型机械装置。适合法师和工匠职业。";
      }
    } else if (race === "半精灵 (Half-Elf)") {
      return "半精灵没有官方亚种区分，但他们拥有极大的灵活性，可以选择提升两项不同的属性值各+1，同时获得两项技能熟练。";
    } else if (race === "半兽人 (Half-Orc)") {
      return "半兽人没有官方亚种区分，但他们是天生的战士，拥有力量+2，体质+1，以及在战斗中展现非凡韧性的能力。";
    } else if (race === "提夫林 (Tiefling)") {
      return "基础提夫林种族特性包括黑暗视觉、智力+1、魅力+2、火焰抗性和一些天生法术能力。在某些设定中有不同恶魔血统的变体。";
    } else if (race === "龙裔 (Dragonborn)") {
      // 龙系描述
      const dragonTypeDescriptions: Record<string, string> = {
        黑龙: "黑龙血统赋予酸性伤害的吐息武器和对酸性伤害的抗性。",
        蓝龙: "蓝龙血统赋予闪电伤害的吐息武器和对闪电伤害的抗性。",
        绿龙: "绿龙血统赋予毒性伤害的吐息武器和对毒性伤害的抗性。",
        红龙: "红龙血统赋予火焰伤害的吐息武器和对火焰伤害的抗性。",
        白龙: "白龙血统赋予冰冷伤害的吐息武器和对冰冷伤害的抗性。",
        金龙: "金龙血统赋予火焰伤害的吐息武器和对火焰伤害的抗性。",
        银龙: "银龙血统赋予冰冷伤害的吐息武器和对冰冷伤害的抗性。",
        铜龙: "铜龙血统赋予酸性伤害的吐息武器和对酸性伤害的抗性。",
        青铜龙: "青铜龙血统赋予闪电伤害的吐息武器和对闪电伤害的抗性。",
        黄铜龙: "黄铜龙血统赋予火焰伤害的吐息武器和对火焰伤害的抗性。",
      };

      return (
        dragonTypeDescriptions[subrace] ||
        "不同的龙系血统提供不同类型的伤害吐息武器和相应的伤害抗性。"
      );
    }

    return "选择一个种族亚种来查看其特性和能力。";
  };

  // 获取种族特性
  const getRaceTraits = (race: string): string[] => {
    switch (race) {
      case "人类 (Human)":
        return [
          "属性提升: 所有属性+1",
          "年龄: 成年较早，寿命不超过100年",
          "体型: 中型",
          "速度: 30尺",
          "语言: 通用语和一门额外语言",
        ];
      case "精灵 (Elf)":
        return [
          "属性提升: 敏捷+2",
          "年龄: 成年约100岁，可活到750岁",
          "黑暗视觉: 60尺",
          "敏锐感官: 察觉技能熟练",
          "精类血统: 对魅惑豁免有优势，魔法无法使你入睡",
          "出神: 不需要睡眠，冥想4小时等同人类8小时睡眠",
        ];
      case "矮人 (Dwarf)":
        return [
          "属性提升: 体质+2",
          "年龄: 成年约50岁，可活到350岁以上",
          "黑暗视觉: 60尺",
          "矮人韧性: 对毒素豁免有优势，对毒素伤害有抗性",
          "矮人战斗训练: 战斧、手斧、轻锤和战锤熟练",
          "石工专业: 有关石头起源的历史检定有加值",
        ];
      case "半身人 (Halfling)":
        return [
          "属性提升: 敏捷+2",
          "年龄: 成年约20岁，通常活到150岁",
          "体型: 小型",
          "速度: 25尺",
          "幸运: 当d20掷出1时可以重骰",
          "勇敢: 对抗恐惧的豁免有优势",
          "灵活: 可以穿过任何比自己大一号的生物空间",
        ];
      case "侏儒 (Gnome)":
        return [
          "属性提升: 智力+2",
          "年龄: 成年约40岁，可活到350-500岁",
          "体型: 小型",
          "速度: 25尺",
          "黑暗视觉: 60尺",
          "侏儒狡黠: 对抗智力、感知和魅力豁免的魔法有优势",
        ];
      case "半精灵 (Half-Elf)":
        return [
          "属性提升: 魅力+2，另外两项自选属性各+1",
          "年龄: 成年约20岁，可活到180岁以上",
          "黑暗视觉: 60尺",
          "精类血统: 对魅惑豁免有优势，魔法无法使你入睡",
          "多才多艺: 获得两项技能熟练",
        ];
      case "半兽人 (Half-Orc)":
        return [
          "属性提升: 力量+2，体质+1",
          "年龄: 成年约14岁，很少活过75岁",
          "黑暗视觉: 60尺",
          "凶恶攻击: 战斗中造成暴击时可额外掷一个武器伤害骰",
          "不屈不挠: 受到致命一击时可以保留1点生命值",
          "威吓天生: 威吓技能熟练",
        ];
      case "提夫林 (Tiefling)":
        return [
          "属性提升: 智力+1，魅力+2",
          "年龄: 与人类相似，但寿命稍长",
          "黑暗视觉: 60尺",
          "地狱抗性: 对火焰伤害有抗性",
          "魔法天赋: 知晓术士戏法，并可施放部分魔法",
        ];
      case "龙裔 (Dragonborn)":
        return [
          "属性提升: 力量+2，魅力+1",
          "年龄: 成长迅速，寿命约80岁",
          "体型: 中型，但比大多数人类高大",
          "速度: 30尺",
          "龙系血统: 获得特定类型的伤害抗性与吐息武器",
          "吐息武器: 可造成2d6点特定类型伤害，15尺锥形范围",
        ];
      default:
        return [];
    }
  };

  // 获取亚种特性
  const getSubraceTraits = (race: string, subrace: string): string[] => {
    if (race === "人类 (Human)") {
      if (subrace === "标准") {
        return ["所有属性值各+1", "不获得其他额外特性"];
      } else if (subrace === "变体") {
        return ["两项自选属性各+1", "获得一项技能熟练", "获得一个专长"];
      }
    } else if (race === "精灵 (Elf)") {
      if (subrace === "高等精灵") {
        return ["智力+1", "获得一个法师戏法", "额外学会一门语言"];
      } else if (subrace === "木精灵") {
        return [
          "感知+1",
          "移动速度提高到35尺",
          "可在轻度遮蔽中尝试隐藏",
          "更擅长森林生存",
        ];
      } else if (subrace === "黑暗精灵") {
        return [
          "魅力+1",
          "黑暗视觉提高到120尺",
          "对阳光敏感",
          "获得额外法术能力",
        ];
      }
    } else if (race === "矮人 (Dwarf)") {
      if (subrace === "丘陵矮人") {
        return ["感知+1", "生命值上限+1", "之后每升一级额外+1生命值"];
      } else if (subrace === "山地矮人") {
        return ["力量+2", "获得轻甲和中甲熟练", "更擅长山地生存"];
      }
    } else if (race === "半身人 (Halfling)") {
      if (subrace === "轻足半身人") {
        return ["魅力+1", "可以通过比自己大一号生物的空间"];
      } else if (subrace === "强魄半身人") {
        return ["体质+1", "对毒素伤害有抗性", "对毒素豁免有优势"];
      }
    } else if (race === "侏儒 (Gnome)") {
      if (subrace === "森林侏儒") {
        return ["敏捷+1", "知晓次级幻术戏法", "可以与小型野兽交流"];
      } else if (subrace === "岩石侏儒") {
        return ["体质+1", "拥有工匠直觉", "可以制作简单机械设备"];
      }
    } else if (race === "龙裔 (Dragonborn)") {
      const dragonResistances: Record<string, string> = {
        黑龙: "酸性伤害抗性，酸性吐息武器",
        蓝龙: "闪电伤害抗性，闪电吐息武器",
        绿龙: "毒性伤害抗性，毒性吐息武器",
        红龙: "火焰伤害抗性，火焰吐息武器",
        白龙: "冰冷伤害抗性，冰冷吐息武器",
        金龙: "火焰伤害抗性，火焰吐息武器",
        银龙: "冰冷伤害抗性，冰冷吐息武器",
        铜龙: "酸性伤害抗性，酸性吐息武器",
        青铜龙: "闪电伤害抗性，闪电吐息武器",
        黄铜龙: "火焰伤害抗性，火焰吐息武器",
      };

      // 使用可选链或类型断言
      return [
        dragonResistances[subrace as keyof typeof dragonResistances] ||
          "特定元素伤害抗性和吐息武器",
      ];
    }

    return [];
  };

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

            {character.race && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">基础种族特性</h3>
                <ul className="space-y-1 text-sm">
                  {getRaceTraits(character.race).map((trait, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></div>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {character.race ? (
              <>
                <h3 className="font-bold text-lg mb-2">{character.race}</h3>
                <p className="my-2 text-sm">
                  {getRaceDescription(character.race)}
                </p>

                {character.subrace && (
                  <div className="mt-6">
                    <h4 className="font-bold text-base mb-2">
                      {character.subrace} 亚种特性
                    </h4>
                    <p className="text-sm mb-4">
                      {getSubraceDescription(character.race, character.subrace)}
                    </p>

                    <ul className="space-y-1 text-sm">
                      {getSubraceTraits(character.race, character.subrace).map(
                        (trait, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-secondary rounded-full mr-2 mt-1.5"></div>
                            <span>{trait}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-2">种族介绍</h3>
                <p className="text-sm">
                  种族决定了你的角色在游戏世界中的外貌和部分能力。每个种族都有其独特的身体特征、文化背景和游戏机制特性。
                </p>
                <p className="text-sm mt-2">种族选择会影响：</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• 基础属性值加成</li>
                  <li>• 特殊能力（如黑暗视觉）</li>
                  <li>• 额外技能和抗性</li>
                  <li>• 角色的外观和文化背景</li>
                </ul>
                <p className="text-sm mt-4 italic text-base-content/70">
                  请选择一个种族和亚种（如果有）来查看详细信息。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceSelectionStep;
