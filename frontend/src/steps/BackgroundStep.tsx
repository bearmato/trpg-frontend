// steps/BackgroundStep.tsx

import React, { useState } from "react";
import { Character, BACKGROUNDS, ALIGNMENTS } from "../types/character";
import { generateCharacterBackground } from "../api/aigm";
import KeywordInput from "../components/KeywordInput";

interface BackgroundStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const BackgroundStep: React.FC<BackgroundStepProps> = ({
  character,
  updateCharacter,
}) => {
  // AI Generation States
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tone, setTone] = useState("balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tones = [
    "balanced",
    "heroic",
    "tragic",
    "comedic",
    "mysterious",
    "dark",
    "epic",
  ];

  // Generate background with AI
  const handleGenerateBackground = async () => {
    if (!character.name || !character.race || !character.characterClass) {
      setError("请先填写角色名称、种族和职业以生成背景故事");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateCharacterBackground({
        name: character.name,
        race: character.race,
        class: character.characterClass,
        keywords: keywords,
        tone: tone,
      });

      // Update character with the generated background
      updateCharacter("backgroundStory", response.background);
    } catch (err) {
      console.error("Error generating background:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate character background"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择背景和阵营</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">背景</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.background}
                onChange={(e) => updateCharacter("background", e.target.value)}
              >
                <option value="">选择背景</option>
                {BACKGROUNDS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text text-lg">阵营</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.alignment}
                onChange={(e) => updateCharacter("alignment", e.target.value)}
              >
                <option value="">选择阵营</option>
                {ALIGNMENTS.map((align) => (
                  <option key={align} value={align}>
                    {align}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="divider my-6">AI 背景生成</div>

            {/* AI Background Generation */}
            <div className="p-4 bg-base-200 rounded-lg mb-4">
              <h3 className="font-bold mb-4">使用 AI 生成背景故事</h3>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">故事基调</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">关键词</span>
                </label>
                <KeywordInput value={keywords} onChange={setKeywords} />
                <label className="label">
                  <span className="label-text-alt">
                    添加关键词增强你的角色背景，如"复仇"、"流亡"、"贵族后裔"等
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
                onClick={handleGenerateBackground}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    生成中...
                  </>
                ) : (
                  "生成背景故事"
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              {character.background ? (
                <>
                  <h3 className="font-bold text-lg">
                    {character.background} 特性
                  </h3>
                  <p className="my-2">
                    {character.background === "侍僧 (Acolyte)"
                      ? "作为一名侍僧，你获得了对宗教仪式的理解和宗教庇护所的支持。你熟练于洞悉和宗教技能。"
                      : character.background === "罪犯 (Criminal)"
                      ? "你有一个犯罪联系人，通过它你可以获取非法物品和情报。你熟练于欺骗和隐匿技能。"
                      : character.background === "民间英雄 (Folk Hero)"
                      ? "普通民众视你为英雄，会尽其所能保护你。你熟练于驯养动物和生存技能。"
                      : character.background === "贵族 (Noble)"
                      ? "你出身于有权势的贵族家庭，拥有特权和社会地位。你熟练于历史和说服技能。"
                      : character.background === "贤者 (Sage)"
                      ? "作为一名学者，你在特定领域拥有广泛的知识。你熟练于奥秘和历史技能。"
                      : character.background === "士兵 (Soldier)"
                      ? "你曾在军队中服役，了解战争的残酷。你熟练于运动和威吓技能。"
                      : character.background === "流浪儿 (Urchin)"
                      ? "你在城市的街道上长大，学会了如何生存。你熟练于巧手和隐匿技能。"
                      : "查看背景详情获取该背景的特性描述。"}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  选择一个背景查看其特性...
                </p>
              )}

              {character.alignment && (
                <div className="mt-4">
                  <h3 className="font-bold text-lg">{character.alignment}</h3>
                  <p className="my-2">
                    {character.alignment === "守序善良 (Lawful Good)"
                      ? "守序善良的角色遵循法律、传统并信守诺言。他们会与邪恶势力抗争，保护弱者。"
                      : character.alignment === "混乱善良 (Chaotic Good)"
                      ? "混乱善良的角色按照自己的良知行事，不喜欢受规则限制，但仍然心地善良。"
                      : character.alignment === "守序中立 (Lawful Neutral)"
                      ? "守序中立的角色尊重权威、诚实和秩序，不关心是否为善或恶。"
                      : character.alignment === "混乱中立 (Chaotic Neutral)"
                      ? "混乱中立的角色跟随自己的意愿行事，重视个人自由高于一切。"
                      : character.alignment === "守序邪恶 (Lawful Evil)"
                      ? "守序邪恶的角色有条理地获取他们想要的东西，不在乎谁会受伤害。"
                      : character.alignment === "混乱邪恶 (Chaotic Evil)"
                      ? "混乱邪恶的角色按照暴力冲动行事，由贪婪、仇恨和追求快乐驱动。"
                      : "阵营代表你的角色在世界中的道德立场和行为准则。"}
                  </p>
                </div>
              )}
            </div>

            {/* AI Generated Background Story */}
            {character.backgroundStory && (
              <div className="bg-base-200 p-4 rounded-lg mt-4">
                <h3 className="font-bold text-lg">背景故事</h3>
                <div className="mt-2 prose">
                  {character.backgroundStory
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundStep;
