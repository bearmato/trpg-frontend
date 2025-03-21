// steps/ClassSelectionStep.tsx

import React from "react";
import { Character, CLASSES } from "../types/character";

interface ClassSelectionStepProps {
  character: Character;
  updateCharacter: (className: string) => void;
}

const ClassSelectionStep: React.FC<ClassSelectionStepProps> = ({
  character,
  updateCharacter,
}) => {
  // 获取职业描述
  const getClassDescription = (className: string): string => {
    switch (className) {
      case "战士 (Fighter)":
        return "战士是武器与防具的大师，能够运用各种武器和战术，通过战斗风格和战技特性在战场上表现出色。他们拥有高生命值、所有武器和防具的熟练，以及多次攻击能力。";
      case "法师 (Wizard)":
        return "法师是奥术魔法的精通者，通过学习掌握多样的法术。他们拥有强大的AOE伤害和工具性法术，但生命值较低。成长后能施放如火球术、闪电束等强力法术，甚至能够停止时间或改变现实。";
      case "游荡者 (Rogue)":
        return "游荡者是技巧和隐匿的专家，擅长潜行、侦查和解除陷阱。他们的偷袭能力可造成大量伤害，并拥有专业技能、巧妙闪避和卓越的技能检定。通常作为队伍中的侦察兵和开锁专家。";
      case "牧师 (Cleric)":
        return "牧师是神圣力量的引导者，从神祇获得治疗与战斗能力。他们能提供强力治疗和团队增益，不同神域提供独特能力。能穿戴中甲和使用盾牌，擅长支援和辅助，同时也有不错的战斗能力。";
      case "野蛮人 (Barbarian)":
        return "野蛮人以狂怒和生存本能战斗，狂暴时获得额外伤害抗性和力量优势。拥有最高的生命值，能够承受巨大伤害，但法术能力有限。他们的战斗能力随着原始道途特性而增强。";
      case "吟游诗人 (Bard)":
        return "吟游诗人是多才多艺的表演者与法师，能通过音乐鼓舞盟友。他们拥有多种实用魔法和激励技能，是社交场合的专家。作为全能型角色，可以支援、伤害和控场，拥有大量技能熟练项。";
      case "德鲁伊 (Druid)":
        return "德鲁伊是自然的守护者，拥有操控元素和野兽变形的能力。他们可以施放强力的自然魔法，控制植物生长，召唤动物，变形为各种生物。根据不同的结社获得特殊能力，如元素掌控或强化变形。";
      case "武僧 (Monk)":
        return "武僧通过内在气的修行掌握独特战斗艺术，能够徒手战斗并使用特殊招式。他们拥有高机动性、疾风骤雨般的攻击和特殊防御能力，如接住箭矢、减免伤害等。可以选择不同的武僧传承专精。";
      case "圣武士 (Paladin)":
        return "圣武士通过神圣誓言获得力量，用正义和坚毅对抗邪恶。他们拥有神圣打击、神术施法和治疗能力。穿戴重甲，同时具备战士的战斗力和部分牧师的神术，守护队友并对抗邪恶势力。";
      case "游侠 (Ranger)":
        return "游侠是荒野中的专家猎人和追踪者。能够掌握特定环境和敌人类型的知识，擅长自然生存和追踪。拥有部分德鲁伊法术，善于远程战斗，可选择猎人或野兽主等专精路线。";
      case "术士 (Sorcerer)":
        return "术士天生具有魔法天赋，无需学习便能掌握强大法术。他们的法术点系统提供施法灵活性，通过血脉力量获得独特能力。可选龙脉、神圣灵魂等不同血统，具有强大的元素伤害和魔法适应性。";
      case "邪术师 (Warlock)":
        return "邪术师与强大的异界存在达成契约，获得神秘的魔法能力。他们拥有独特的契约魔法、可快速恢复的法术位和强大的魔导书增强。能够选择不同契约主人，如至高、邪魔或精魂，获得对应特性。";
      default:
        return "选择一个职业来查看详细特性和能力说明。";
    }
  };

  // 获取职业的主要特性
  const getClassFeatures = (className: string): string[] => {
    switch (className) {
      case "战士 (Fighter)":
        return [
          "生命骰: d10",
          "专长选择: 战斗流派、战技、额外攻击",
          "主要能力值: 力量或敏捷",
          "护甲熟练: 全部",
          "武器熟练: 全部",
          "豁免熟练: 力量, 体质",
        ];
      case "法师 (Wizard)":
        return [
          "生命骰: d6",
          "专长选择: 奥术传统、法术书、奥术恢复",
          "主要能力值: 智力",
          "护甲熟练: 无",
          "武器熟练: 匕首, 飞镖, 投石索, 手弩, 长弓",
          "豁免熟练: 智力, 感知",
        ];
      case "游荡者 (Rogue)":
        return [
          "生命骰: d8",
          "专长选择: 专业技能、偷袭、诡术",
          "主要能力值: 敏捷",
          "护甲熟练: 轻甲",
          "武器熟练: 简单武器, 手弩, 长剑, 刺剑, 短剑",
          "豁免熟练: 敏捷, 智力",
        ];
      case "牧师 (Cleric)":
        return [
          "生命骰: d8",
          "专长选择: 神域、引导神力、神圣干涉",
          "主要能力值: 感知",
          "护甲熟练: 轻甲, 中甲, 盾牌",
          "武器熟练: 简单武器",
          "豁免熟练: 感知, 魅力",
        ];
      case "野蛮人 (Barbarian)":
        return [
          "生命骰: d12",
          "专长选择: 狂暴、无甲防御、原始道途",
          "主要能力值: 力量",
          "护甲熟练: 轻甲, 中甲, 盾牌",
          "武器熟练: 简单武器, 军用武器",
          "豁免熟练: 力量, 体质",
        ];
      case "吟游诗人 (Bard)":
        return [
          "生命骰: d8",
          "专长选择: 诗人学院、激励、诗人灵感",
          "主要能力值: 魅力",
          "护甲熟练:轻甲",
          "武器熟练: 简单武器, 手弩, 长剑, 刺剑, 短剑",
          "豁免熟练: 敏捷, 魅力",
        ];
      case "德鲁伊 (Druid)":
        return [
          "生命骰: d8",
          "专长选择: 结社、野兽形态、自然恢复",
          "主要能力值: 感知",
          "护甲熟练: 轻甲, 中甲 (非金属), 盾牌 (非金属)",
          "武器熟练: 匕首, 飞镖, 投石索, 长棍, 长矛, 轻锤, 镰刀, 剑",
          "豁免熟练: 智力, 感知",
        ];
      case "武僧 (Monk)":
        return [
          "生命骰: d8",
          "专长选择: 武术传承、气、疾风连击",
          "主要能力值: 敏捷, 感知",
          "护甲熟练: 无",
          "武器熟练: 简单武器, 短剑",
          "豁免熟练: 力量, 敏捷",
        ];
      case "圣武士 (Paladin)":
        return [
          "生命骰: d10",
          "专长选择: 圣武誓言、神圣打击、神术施法",
          "主要能力值: 力量, 魅力",
          "护甲熟练: 全部",
          "武器熟练: 全部",
          "豁免熟练: 感知, 魅力",
        ];
      case "游侠 (Ranger)":
        return [
          "生命骰: d10",
          "专长选择: 擅长敌人、游侠协作、游侠道途",
          "主要能力值: 敏捷, 感知",
          "护甲熟练: 轻甲, 中甲, 盾牌",
          "武器熟练: 简单武器, 军用武器",
          "豁免熟练: 力量, 敏捷",
        ];
      case "术士 (Sorcerer)":
        return [
          "生命骰: d6",
          "专长选择: 术法血统、法术点、超魔",
          "主要能力值: 魅力",
          "护甲熟练: 无",
          "武器熟练: 匕首, 飞镖, 投石索, 长弓, 轻弩",
          "豁免熟练: 体质, 魅力",
        ];
      case "邪术师 (Warlock)":
        return [
          "生命骰: d8",
          "专长选择: 契约主人、契约恩赐、灵契魔法",
          "主要能力值: 魅力",
          "护甲熟练: 轻甲",
          "武器熟练: 简单武器",
          "豁免熟练: 感知, 魅力",
        ];
      default:
        return [];
    }
  };

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
                onChange={(e) => updateCharacter(e.target.value)}
              >
                <option value="">选择职业</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {character.characterClass && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">职业特性</h3>
                <ul className="space-y-1 text-sm">
                  {getClassFeatures(character.characterClass).map(
                    (feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {character.characterClass ? (
              <>
                <h3 className="font-bold text-lg mb-2">
                  {character.characterClass}
                </h3>
                <p className="my-2 text-base-content text-sm">
                  {getClassDescription(character.characterClass)}
                </p>
                <div className="mt-4 text-sm">
                  <p className="italic text-base-content/80">
                    选择职业是角色构建的核心决定，它将决定你的战斗风格、能力和在团队中的角色。
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-2">职业介绍</h3>
                <p className="text-base-content text-sm">
                  职业是角色在冒险中的专业和训练方向。每个职业都提供独特的能力、专长和游戏风格。
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  <li>
                    🗡️{" "}
                    <span className="font-semibold">战士、野蛮人、圣武士</span>{" "}
                    - 擅长近战和承受伤害
                  </li>
                  <li>
                    🏹 <span className="font-semibold">游侠、游荡者</span> -
                    擅长远程攻击和技巧
                  </li>
                  <li>
                    ✨ <span className="font-semibold">法师、术士、邪术师</span>{" "}
                    - 掌握强大的奥术魔法
                  </li>
                  <li>
                    🌟 <span className="font-semibold">牧师、德鲁伊</span> -
                    引导神圣或自然力量
                  </li>
                  <li>
                    🎵 <span className="font-semibold">吟游诗人</span> -
                    全能型角色，擅长支援
                  </li>
                  <li>
                    👊 <span className="font-semibold">武僧</span> -
                    掌握气的力量进行徒手作战
                  </li>
                </ul>
                <p className="mt-4 italic text-base-content/80">
                  请选择一个与你想象中角色形象相符的职业。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelectionStep;
