// steps/PortraitStep.tsx

import React, { useState } from "react";
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

  const featureSuggestions = [
    "scarred face",
    "blue eyes",
    "green eyes",
    "brown eyes",
    "white hair",
    "black hair",
    "blonde hair",
    "red hair",
    "tattoos",
    "piercings",
    "beard",
    "clean shaven",
    "one-eyed",
    "tall",
    "short",
    "slim",
    "muscular",
    "dark skin",
    "pale skin",
    "medium skin",
    "pointed ears",
    "long hair",
    "short hair",
    "braided hair",
    "hooded",
  ];

  // Generate portrait with AI
  const handleGeneratePortrait = async () => {
    if (!character.race || !character.characterClass) {
      setError("请先填写角色种族和职业以生成立绘");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateCharacterPortrait({
        name: character.name,
        race: character.race,
        class: character.characterClass,
        gender: gender,
        style: style,
        features: features,
      });

      // Update character with portrait info
      updateCharacter("portraitUrl", response.image_url);
      updateCharacter("gender", gender);
      updateCharacter("features", features);
    } catch (err) {
      console.error("Error generating portrait:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate character portrait"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
                onChange={(e) => {
                  setGender(e.target.value);
                  updateCharacter("gender", e.target.value);
                }}
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
              </label>
              <KeywordInput
                value={features}
                onChange={(newFeatures) => {
                  setFeatures(newFeatures);
                  updateCharacter("features", newFeatures);
                }}
                suggestions={featureSuggestions}
              />
              <label className="label">
                <span className="label-text-alt">
                  添加关键词来描述角色的外观特征
                </span>
              </label>
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
          </div>

          <div className="flex flex-col items-center justify-center">
            {character.portraitUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={character.portraitUrl}
                  alt={`${character.name || "角色"}立绘`}
                  className="max-w-full rounded-lg shadow-lg border-2 border-primary max-h-96 object-contain"
                />
                <p className="mt-4 text-center text-sm text-base-content/70">
                  角色立绘已生成，将会保存到角色资料中
                </p>
              </div>
            ) : (
              <div className="bg-base-200 p-8 rounded-lg text-center max-w-md">
                <div className="text-6xl mb-6 opacity-30">🖼️</div>
                <h3 className="font-bold text-lg mb-2">尚未生成立绘</h3>
                <p>
                  填写左侧表单并点击"生成角色立绘"按钮，AI将为你创建与角色设定相符的形象。
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
