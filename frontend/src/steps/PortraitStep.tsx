// steps/PortraitStep.tsx

import React, { useState, useRef } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);

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

  // Get recommended features based on race and class
  const getRecommendedFeatures = () => {
    // Basic features
    const commonFeatures = [
      "eyes",
      "hair",
      "face",
      "expression",
      "detailed",
      "high quality",
    ];

    // Race-specific features
    const raceSpecificFeatures: Record<string, string[]> = {
      Dragonborn: ["scales", "draconic", "reptilian", "horns", "snout", "tail"],
      Elf: [
        "pointed ears",
        "elegant",
        "graceful",
        "slender",
        "almond eyes",
        "ethereal",
      ],
      Dwarf: [
        "beard",
        "stocky",
        "sturdy",
        "braided hair",
        "runic",
        "deep-set eyes",
      ],
      Halfling: [
        "small",
        "nimble",
        "cheerful",
        "curly hair",
        "barefoot",
        "rosy cheeks",
      ],
      Gnome: [
        "tiny",
        "large head",
        "bright eyes",
        "animated",
        "clever",
        "curious",
      ],
      "Half-Elf": [
        "slight pointed ears",
        "refined",
        "charismatic",
        "mixed features",
        "elegant",
      ],
      "Half-Orc": [
        "tusks",
        "muscular",
        "imposing",
        "strong jaw",
        "fierce",
        "tribal markings",
      ],
      Tiefling: [
        "horns",
        "tail",
        "glowing eyes",
        "demonic",
        "sharp features",
        "exotic",
      ],
      Human: [
        "diverse",
        "adaptable",
        "balanced features",
        "expressive",
        "versatile",
      ],
    };

    // Class-specific features
    const classSpecificFeatures: Record<string, string[]> = {
      Fighter: [
        "armored",
        "battle-scarred",
        "muscular",
        "weapon",
        "determined",
        "martial",
      ],
      Wizard: [
        "robes",
        "spellbook",
        "arcane symbols",
        "staff",
        "mystical",
        "scholarly",
      ],
      Rogue: [
        "hooded",
        "stealthy",
        "agile",
        "daggers",
        "leather armor",
        "shadowy",
      ],
      Cleric: [
        "holy symbol",
        "blessed",
        "divine",
        "religious garments",
        "aura",
        "devout",
      ],
      Ranger: [
        "bow",
        "wilderness gear",
        "rugged",
        "cloaked",
        "nature-worn",
        "alert",
      ],
      Paladin: [
        "shining armor",
        "holy weapon",
        "righteous",
        "noble",
        "commanding",
        "aura",
      ],
      Bard: [
        "instrument",
        "flamboyant",
        "charming",
        "colorful clothes",
        "artistic",
        "expressive",
      ],
      Druid: [
        "natural",
        "wild",
        "primal",
        "animal aspects",
        "organic",
        "nature symbols",
      ],
      Monk: [
        "simple clothes",
        "disciplined",
        "focused",
        "martial arts",
        "meditative",
        "balanced",
      ],
      Sorcerer: [
        "magical aura",
        "innate power",
        "mystical marks",
        "intense eyes",
        "otherworldly",
      ],
      Warlock: [
        "eldritch",
        "dark",
        "mysterious",
        "occult symbols",
        "patron marks",
        "otherworldly",
      ],
      Barbarian: [
        "tribal",
        "fierce",
        "muscular",
        "war paint",
        "primal",
        "battle-ready",
      ],
    };

    // Background-specific features
    const backgroundSpecificFeatures: Record<string, string[]> = {
      Acolyte: ["religious", "pious", "humble", "contemplative"],
      Criminal: ["shifty", "alert", "streetwise", "cautious"],
      "Folk Hero": ["approachable", "determined", "inspiring", "humble"],
      Noble: ["refined", "proud", "well-dressed", "dignified"],
      Sage: ["scholarly", "thoughtful", "wise", "knowledgeable"],
      Soldier: ["disciplined", "battle-hardened", "alert", "proud"],
      Urchin: ["scrappy", "nimble", "street-smart", "resourceful"],
      Entertainer: ["charismatic", "expressive", "flamboyant", "artistic"],
      "Guild Artisan": ["skilled", "detail-oriented", "practical", "focused"],
    };

    // Get features based on character's race and class
    const raceFeatures = raceSpecificFeatures[character.race] || [];
    const classFeatures =
      classSpecificFeatures[character.character_class] || [];
    const backgroundFeatures =
      backgroundSpecificFeatures[character.background] || [];

    // Combine all features
    return [
      ...commonFeatures,
      ...raceFeatures,
      ...classFeatures,
      ...backgroundFeatures,
    ];
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
    if (!character.name || !character.race || !character.character_class) {
      setError(
        "Please fill in character name, race, and class before generating portrait"
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationInfo(null);

    try {
      const response = await generateCharacterPortrait({
        name: character.name,
        race: character.race,
        class: character.character_class,
        gender: gender,
        style: style,
        features: features,
      });

      console.log("Portrait generation response:", response);

      // 更新角色肖像URL
      updateCharacter("portrait_url", response.image_url);

      // 保存Cloudinary public_id（如果有）
      if (response.public_id) {
        updateCharacter("portrait_public_id", response.public_id);
        console.log("已保存Cloudinary public_id:", response.public_id);
      }

      // 显示生成信息
      setGenerationInfo("Portrait generated successfully!");

      // 滚动到肖像区域
      setTimeout(() => {
        const portraitElement = document.getElementById("character-portrait");
        if (portraitElement) {
          portraitElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } catch (err) {
      console.error("Error generating portrait:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate portrait"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Character Portrait</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg">Gender</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={gender}
                onChange={(e) => handleGenderChange(e.target.value)}
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g === "male"
                      ? "Male"
                      : g === "female"
                      ? "Female"
                      : "Non-binary"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg">Art Style</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s === "fantasy"
                      ? "Fantasy"
                      : s === "realistic"
                      ? "Realistic"
                      : s === "anime"
                      ? "Anime"
                      : s === "comic"
                      ? "Comic"
                      : s === "watercolor"
                      ? "Watercolor"
                      : s === "oil painting"
                      ? "Oil Painting"
                      : s === "pixel art"
                      ? "Pixel Art"
                      : s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg">Appearance Features</span>
                <span className="label-text-alt">
                  English keywords recommended for better results
                </span>
              </label>
              <KeywordInput
                value={features}
                onChange={handleFeaturesChange}
                suggestions={getRecommendedFeatures()}
              />
              <label className="label">
                <span className="label-text-alt">
                  Add keywords to describe your character's appearance.
                  Suggestions are based on your character's settings.
                </span>
              </label>
            </div>

            <button
              className={`btn btn-primary w-full ${
                isLoading ? "btn-disabled animate-pulse" : ""
              }`}
              onClick={handleGeneratePortrait}
              disabled={isLoading}
            >
              {isLoading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {isLoading ? "Generating..." : "Generate Portrait"}
            </button>

            {error && (
              <div className="alert alert-error mt-4">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mx-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    ></path>
                  </svg>
                  <label>{error}</label>
                </div>
              </div>
            )}

            {generationInfo && (
              <div className="alert alert-success mt-4">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mx-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <label>{generationInfo}</label>
                </div>
              </div>
            )}
          </div>

          {/* Portrait Display */}
          <div className="bg-base-200 p-4 rounded-lg" id="character-portrait">
            <h3 className="font-bold text-lg mb-3">Character Portrait</h3>
            {character.portrait_url ? (
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  ref={imgRef}
                  src={character.portrait_url}
                  alt="Character Portrait"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      character.portrait_url
                    );
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder-image.svg";
                    setError(
                      "Failed to load portrait image. Please try generating again."
                    );
                  }}
                />
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-base-300 flex items-center justify-center">
                <p className="text-center text-gray-500">
                  Generate a portrait using the options on the left.
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
