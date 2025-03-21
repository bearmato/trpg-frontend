// steps/PortraitStep.tsx

import React, { useState, useEffect } from "react";
import { Character } from "../types/character";
import { generateCharacterPortrait } from "../api/aigm";
import KeywordInput from "../components/KeywordInput";

interface PortraitStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const PortraitStep: React.FC<PortraitStepProps> = ({
  character,
  updateCharacter,
}) => {
  // States for portrait generation
  const [gender, setGender] = useState(character.gender || "male");
  const [style, setStyle] = useState("fantasy");
  const [features, setFeatures] = useState<string[]>(character.features || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationInfo, setGenerationInfo] = useState<string | null>(null);

  // Predefined options
  const styles = [
    "fantasy",
    "realistic",
    "anime",
    "comic",
    "watercolor",
    "oil painting",
    "pixel art",
  ];

  const genders = ["male", "female", "non-binary"];

  // 根据种族和职业获取推荐的特征词
  const getRecommendedFeatures = () => {
    // 基础特征词
    const commonFeatures = [
      "eyes",
      "hair",
      "face",
      "expression",
      "detailed",
      "high quality",
    ];

    // 种族特征词
    const raceSpecificFeatures: Record<string, string[]> = {
      "龙裔 (Dragonborn)": [
        "scales",
        "draconic",
        "reptilian",
        "horns",
        "snout",
        "tail",
      ],
      "精灵 (Elf)": [
        "pointed ears",
        "elegant",
        "graceful",
        "slender",
        "almond eyes",
        "ethereal",
      ],
      "矮人 (Dwarf)": [
        "beard",
        "stocky",
        "sturdy",
        "braided hair",
        "runic",
        "deep-set eyes",
      ],
      "半身人 (Halfling)": [
        "small",
        "nimble",
        "cheerful",
        "curly hair",
        "barefoot",
        "rosy cheeks",
      ],
      "侏儒 (Gnome)": [
        "tiny",
        "large head",
        "bright eyes",
        "animated",
        "clever",
        "curious",
      ],
      "半精灵 (Half-Elf)": [
        "slight pointed ears",
        "refined",
        "charismatic",
        "mixed features",
        "elegant",
      ],
      "半兽人 (Half-Orc)": [
        "tusks",
        "green skin",
        "strong jaw",
        "powerful",
        "fierce",
        "intimidating",
      ],
      "提夫林 (Tiefling)": [
        "horns",
        "tail",
        "unusual eyes",
        "fiendish",
        "mystical",
        "pointed teeth",
      ],
      "人类 (Human)": [
        "diverse",
        "adaptable",
        "expressive",
        "versatile",
        "cultural attire",
      ],
    };

    // 职业特征词
    const classSpecificFeatures: Record<string, string[]> = {
      "战士 (Fighter)": [
        "armor",
        "weapons",
        "battle-ready",
        "disciplined",
        "tactical",
        "strong",
      ],
      "法师 (Wizard)": [
        "robes",
        "spellbook",
        "arcane focus",
        "magical symbols",
        "studious",
        "thoughtful",
      ],
      "游荡者 (Rogue)": [
        "hooded",
        "daggers",
        "leather armor",
        "stealthy",
        "alert",
        "cunning",
      ],
      "牧师 (Cleric)": [
        "holy symbol",
        "religious garb",
        "divine",
        "resolute",
        "aura",
        "pious",
      ],
      "野蛮人 (Barbarian)": [
        "tribal",
        "fierce",
        "muscular",
        "war paint",
        "primal",
        "untamed",
      ],
      "吟游诗人 (Bard)": [
        "instrument",
        "colorful attire",
        "charismatic",
        "performer",
        "expressive",
        "charming",
      ],
      "德鲁伊 (Druid)": [
        "natural elements",
        "staff",
        "animal themed",
        "leaves",
        "nature affinity",
        "serene",
      ],
      "武僧 (Monk)": [
        "disciplined",
        "simple clothes",
        "focused",
        "meditative",
        "balanced",
        "flowing",
      ],
      "圣武士 (Paladin)": [
        "shining armor",
        "holy symbol",
        "righteous",
        "noble",
        "commanding",
        "radiant",
      ],
      "游侠 (Ranger)": [
        "bow",
        "wilderness gear",
        "cloaked",
        "vigilant",
        "tracker",
        "natural",
      ],
      "术士 (Sorcerer)": [
        "innate magic",
        "magical aura",
        "mystical eyes",
        "arcane symbols",
        "confident",
        "powerful",
      ],
      "邪术师 (Warlock)": [
        "eldritch",
        "mysterious",
        "patron symbols",
        "otherworldly",
        "dark",
        "commanding",
      ],
    };

    // 获取适用于当前种族和职业的特征
    const raceFeatures = raceSpecificFeatures[character.race] || [];
    const classFeatures = classSpecificFeatures[character.characterClass] || [];

    // 组合特征词，去除重复项
    return [...new Set([...raceFeatures, ...classFeatures, ...commonFeatures])];
  };

  // 更新角色性别
  const handleGenderChange = (newGender: string) => {
    setGender(newGender);
    updateCharacter("gender", newGender);
  };

  // 更新特征列表
  const handleFeaturesChange = (newFeatures: string[]) => {
    setFeatures(newFeatures);
    updateCharacter("features", newFeatures);
  };

  // 生成立绘
  const handleGeneratePortrait = async () => {
    if (!character.race || !character.characterClass) {
      setError("请先填写角色种族和职业以生成立绘");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationInfo("正在生成角色立绘，这可能需要10-20秒...");

    try {
      const response = await generateCharacterPortrait({
        name: character.name,
        race: character.race,
        subrace: character.subrace,
        class: character.characterClass,
        gender: gender,
        style: style,
        features: features,
      });

      // 更新角色立绘URL
      updateCharacter("portraitUrl", response.image_url);
      setGenerationInfo("立绘生成成功！");

      setTimeout(() => {
        setGenerationInfo(null);
      }, 3000);
    } catch (err) {
      console.error("生成立绘时出错:", err);
      setError(err instanceof Error ? err.message : "生成角色立绘失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 当种族或职业变化时，自动添加相关特征词
  useEffect(() => {
    if (character.race && character.characterClass && features.length === 0) {
      // 为不同种族和职业添加推荐特征词
      const allFeatureSuggestions = getRecommendedFeatures();
      // 选择2-3个最具代表性的特征
      const selectedFeatures = allFeatureSuggestions.slice(0, 3);

      if (selectedFeatures.length > 0) {
        handleFeaturesChange(selectedFeatures);
      }
    }
  }, [character.race, character.characterClass]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">角色立绘</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg">性别</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={gender}
                onChange={(e) => handleGenderChange(e.target.value)}
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g === "male"
                      ? "男性"
                      : g === "female"
                      ? "女性"
                      : "非二元性别"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg">艺术风格</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s === "fantasy"
                      ? "奇幻风格"
                      : s === "realistic"
                      ? "写实风格"
                      : s === "anime"
                      ? "动漫风格"
                      : s === "comic"
                      ? "漫画风格"
                      : s === "watercolor"
                      ? "水彩风格"
                      : s === "oil painting"
                      ? "油画风格"
                      : s === "pixel art"
                      ? "像素风格"
                      : s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-lg">外貌特征</span>
                <span className="label-text-alt">
                  推荐使用英文关键词效果更好
                </span>
              </label>
              <KeywordInput
                value={features}
                onChange={handleFeaturesChange}
                suggestions={getRecommendedFeatures()}
              />
              <label className="label">
                <span className="label-text-alt">
                  添加关键词来描述角色的外观特征，已自动推荐符合你角色设定的词汇
                </span>
              </label>
            </div>

            <div className="bg-base-200 p-3 rounded-lg mb-4">
              <h3 className="font-semibold mb-1">立绘生成提示</h3>
              <p className="text-sm">
                系统将根据你选择的种族和职业生成符合D&D设定的角色立绘。每个种族和职业都有其独特的视觉特征，如
                {character.race ? `${character.race}的` : "种族的"}
                {character.race === "龙裔 (Dragonborn)"
                  ? "鳞片和龙型头部"
                  : character.race === "精灵 (Elf)"
                  ? "尖耳朵和优雅姿态"
                  : character.race === "矮人 (Dwarf)"
                  ? "粗壮体格和浓密胡须"
                  : character.race === "半身人 (Halfling)"
                  ? "小巧身材和灵活特征"
                  : character.race === "提夫林 (Tiefling)"
                  ? "角和尾巴"
                  : "特有外观"}
                ，以及
                {character.characterClass
                  ? `${character.characterClass}的`
                  : "职业的"}
                {character.characterClass === "战士 (Fighter)"
                  ? "盔甲和武器"
                  : character.characterClass === "法师 (Wizard)"
                  ? "法师袍和奥术道具"
                  : character.characterClass === "游荡者 (Rogue)"
                  ? "轻装和匕首"
                  : character.characterClass === "牧师 (Cleric)"
                  ? "宗教符号和神圣装饰"
                  : "标志性装备"}
                。
              </p>
            </div>

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

            {generationInfo && !error && (
              <div className="alert alert-info mb-4">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{generationInfo}</span>
              </div>
            )}

            <button
              className="btn btn-primary w-full"
              onClick={handleGeneratePortrait}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  生成中...
                </>
              ) : (
                "生成角色立绘"
              )}
            </button>

            <p className="text-xs text-center mt-2 opacity-75">
              生成过程可能需要10-20秒，请耐心等待
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            {character.portraitUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={character.portraitUrl}
                  alt={`${character.name || "角色"}立绘`}
                  className="max-w-full rounded-lg shadow-lg border-2 border-primary max-h-96 object-contain"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-semibold">
                    {character.name ||
                      character.race + " " + character.characterClass}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {character.race} · {character.characterClass} ·{" "}
                    {gender === "male"
                      ? "男性"
                      : gender === "female"
                      ? "女性"
                      : "非二元性别"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-base-200 p-8 rounded-lg text-center max-w-md h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-6 opacity-30">🖼️</div>
                <h3 className="font-bold text-lg mb-2">尚未生成立绘</h3>
                <p className="mb-4">
                  填写左侧表单并点击"生成角色立绘"按钮，AI将为你创建符合D&D设定的角色形象。
                </p>
                <p className="text-sm text-primary">
                  立绘将忠实展现你的角色种族和职业特征
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortraitStep;
