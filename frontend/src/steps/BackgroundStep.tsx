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
  const [language, setLanguage] = useState("english");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tones = [
    "balanced",
    "heroic",
    "tragic",
    "comedic",
    "mysterious",
    "dark",
    "epic",
  ];

  const languages = ["chinese", "english"];

  // 获取背景说明
  const getBackgroundDescription = (backgroundName: string): string => {
    switch (backgroundName) {
      case "侍僧 (Acolyte)":
        return "作为侍僧，你在神殿或修道院中度过了光阴，学习传统、仪式和祷告。你拥有避难所特性，可在同信仰的宗教组织获得食宿。你熟练于洞悉和宗教技能，并额外学会两种语言。";
      case "罪犯 (Criminal)":
        return "作为罪犯，你曾经靠非法手段谋生。你有一个可靠的犯罪联系人，能提供情报和地下网络联系。你熟练于欺骗和隐匿技能，以及盗贼工具和一种游戏组。";
      case "民间英雄 (Folk Hero)":
        return "作为民间英雄，你因某次英勇行为而成名。普通民众会尽可能地帮助和收留你。你熟练于驯兽和生存技能，以及一种工匠工具和陆上载具。";
      case "贵族 (Noble)":
        return "作为贵族，你出身或被邀入上流社会。你拥有特权地位，能在高等社会受到优待。你熟练于历史和说服技能，以及一种游戏组，并额外学会一种语言。";
      case "贤者 (Sage)":
        return "作为贤者，你一生致力于知识和研究。当你不知道某信息时，通常知道可以在哪里找到它。你熟练于奥秘和历史技能，并额外学会两种语言。";
      case "士兵 (Soldier)":
        return "作为士兵，你曾在军队或雇佣兵团服役。你拥有被战友认可的军衔和影响力。你熟练于运动和威吓技能，以及一种游戏组和陆上载具。";
      case "流浪儿 (Urchin)":
        return "作为流浪儿，你在城市街头长大。你了解城市的秘密通道，能更快地穿行。你熟练于巧手和隐匿技能，以及盗贼工具和伪装工具包。";
      case "艺人 (Entertainer)":
        return "作为艺人，你通过表演谋生。你在一些地方有粉丝，能获得免费食宿和表演机会。你熟练于体操和表演技能，以及伪装工具包和一种乐器。";
      case "公会工匠 (Guild Artisan)":
        return "作为公会工匠，你精通某种工艺。公会成员会为你提供各种支持和帮助。你熟练于洞悉和说服技能，以及一种工匠工具，并额外学会一种语言。";
      default:
        return "选择一个背景来了解其特性和技能熟练项。";
    }
  };

  // 获取阵营说明
  const getAlignmentDescription = (alignmentName: string): string => {
    switch (alignmentName) {
      case "守序善良 (Lawful Good)":
        return "守序善良的角色相信规则和善良行为。他们尊重权威，保护弱者，对抗邪恶，但遵循法律和传统。这类角色可能是忠诚的骑士或公正的法官。";
      case "中立善良 (Neutral Good)":
        return "中立善良的角色关注的是做好事，而不太在意规则。他们会做最能带来善良结果的事，不论是否符合法律。这类角色可能是治疗者或慈善家。";
      case "混乱善良 (Chaotic Good)":
        return "混乱善良的角色遵循自己的道德准则，重视个人自由与善良行为。他们抵抗压迫，蔑视规则，但为了更大的善。可能是义贼或独立思想家。";
      case "守序中立 (Lawful Neutral)":
        return "守序中立的角色信奉秩序和规则高于一切，不偏向善恶。他们遵循法律的字面意义。这类角色可能是不偏不倚的法官或忠诚的士兵。";
      case "绝对中立 (True Neutral)":
        return "绝对中立的角色追求平衡，避免极端，或只关注自己的事务。他们基于情况做出实际决定。这类角色可能是德鲁伊或实用主义者。";
      case "混乱中立 (Chaotic Neutral)":
        return "混乱中立的角色珍视自由和冲动，不刻意行善或作恶。他们追求最大化自由，蔑视规则。这类角色可能是放浪形骸的艺术家或无拘无束的游荡者。";
      case "守序邪恶 (Lawful Evil)":
        return "守序邪恶的角色有条理地追求邪恶目标，同时维持一套荣誉准则。他们利用规则为自己谋取利益。这类角色可能是暴君或有组织的罪犯。";
      case "中立邪恶 (Neutral Evil)":
        return "中立邪恶的角色毫无原则地追求自身利益，不关心他人。他们会做任何获取所需的事。这类角色可能是冷血杀手或纯粹的机会主义者。";
      case "混乱邪恶 (Chaotic Evil)":
        return "混乱邪恶的角色由暴力和残忍的冲动驱使，蔑视规则和他人福祉。他们既危险又不可预测。这类角色可能是狂徒或虐待狂。";
      default:
        return "选择一个阵营来了解其价值观和行为准则。";
    }
  };

  // Generate background with AI
  const handleGenerateBackground = async () => {
    if (!character.name || !character.race || !character.characterClass) {
      setError("请先填写角色名称、种族和职业以生成背景故事");
      return;
    }

    if (!character.background) {
      setError("请选择一个角色背景");
      return;
    }

    if (!character.alignment) {
      setError("请选择一个角色阵营");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await generateCharacterBackground({
        name: character.name,
        race: character.race,
        class: character.characterClass,
        background: character.background,
        alignment: character.alignment,
        keywords: keywords,
        tone: tone,
        language: language,
      });

      // 更新角色背景故事
      updateCharacter("backgroundStory", response.background);

      // 显示成功信息
      setSuccessMessage(
        language === "chinese"
          ? "背景故事已生成成功！"
          : "Background story generated successfully!"
      );

      // 滚动到背景故事区域
      setTimeout(() => {
        const storyElement = document.getElementById("background-story");
        if (storyElement) {
          storyElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } catch (err) {
      console.error("生成背景时出错:", err);
      setError(err instanceof Error ? err.message : "生成角色背景失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择背景和阵营</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
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

              {character.background && (
                <div className="mt-2 p-3 bg-base-200 rounded-md">
                  <p className="text-sm">
                    {getBackgroundDescription(character.background)}
                  </p>
                </div>
              )}
            </div>

            <div className="form-control w-full">
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

              {character.alignment && (
                <div className="mt-2 p-3 bg-base-200 rounded-md">
                  <p className="text-sm">
                    {getAlignmentDescription(character.alignment)}
                  </p>
                </div>
              )}
            </div>

            {/* AI 背景生成部分 */}
            <div className="p-4 bg-base-200 rounded-lg border border-base-200/30">
              <h3 className="font-bold text-lg mb-3 ">AI背景生成器</h3>
              <p className="text-sm mb-4">
                使用AI生成符合D&D规则的角色背景故事，基于你选择的背景、阵营和其他细节。
              </p>

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
                      {t === "balanced"
                        ? "平衡"
                        : t === "heroic"
                        ? "英雄"
                        : t === "tragic"
                        ? "悲剧"
                        : t === "comedic"
                        ? "喜剧"
                        : t === "mysterious"
                        ? "神秘"
                        : t === "dark"
                        ? "黑暗"
                        : t === "epic"
                        ? "史诗"
                        : t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 语言选择下拉框 */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">语言 / Language</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "chinese"
                        ? "中文"
                        : lang === "english"
                        ? "English"
                        : lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">关键词</span>
                </label>
                <KeywordInput value={keywords} onChange={setKeywords} />
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

              {successMessage && (
                <div className="alert alert-success mb-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                className="btn btn-primary w-full"
                onClick={handleGenerateBackground}
                disabled={
                  isLoading || !character.background || !character.alignment
                }
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {language === "chinese" ? "生成中..." : "Generating..."}
                  </>
                ) : language === "chinese" ? (
                  "生成背景故事"
                ) : (
                  "Generate Background Story"
                )}
              </button>

              <p className="text-xs text-center mt-2 text-base-content/70">
                {language === "chinese"
                  ? "基于选择的背景、阵营和关键词生成符合D&D规则的背景故事"
                  : "Generates a D&D-compliant background story based on your choices"}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              {character.background && character.alignment ? (
                <>
                  <h3 className="font-bold text-lg mb-1">背景与阵营分析</h3>
                  <p className="text-sm mb-3">
                    <span className="font-semibold">
                      {character.background}
                    </span>
                    与
                    <span className="font-semibold">{character.alignment}</span>
                    的组合塑造了一个独特的角色性格与动机。
                  </p>
                  <div className="divider my-2"></div>
                  <h4 className="font-semibold">可能的角色特征:</h4>
                  <ul className="mt-1 space-y-1 text-sm list-disc list-inside">
                    {character.background === "侍僧 (Acolyte)" &&
                      character.alignment === "守序善良 (Lawful Good)" && (
                        <>
                          <li>严格遵守宗教教义的虔诚信徒</li>
                          <li>将神圣法律视为最高权威</li>
                          <li>致力于通过信仰传播善良与秩序</li>
                        </>
                      )}
                    {character.background === "侍僧 (Acolyte)" &&
                      character.alignment === "混乱善良 (Chaotic Good)" && (
                        <>
                          <li>信仰精神而非教条的改革派信徒</li>
                          <li>质疑宗教机构但坚守核心价值</li>
                          <li>用自己的方式解读和实践神圣教义</li>
                        </>
                      )}
                    {character.background === "罪犯 (Criminal)" &&
                      character.alignment === "中立善良 (Neutral Good)" && (
                        <>
                          <li>类似侠盗罗宾汉的人物</li>
                          <li>用非法手段达成善良目的</li>
                          <li>对抗更大的不公和压迫</li>
                        </>
                      )}
                    {character.background === "罪犯 (Criminal)" &&
                      character.alignment === "混乱中立 (Chaotic Neutral)" && (
                        <>
                          <li>追求个人自由的亡命徒</li>
                          <li>对权威有深刻的不信任</li>
                          <li>依靠直觉而非规则行事</li>
                        </>
                      )}
                    {/* 默认组合特征 */}
                    {!(
                      (character.background === "侍僧 (Acolyte)" &&
                        (character.alignment === "守序善良 (Lawful Good)" ||
                          character.alignment === "混乱善良 (Chaotic Good)")) ||
                      (character.background === "罪犯 (Criminal)" &&
                        (character.alignment === "中立善良 (Neutral Good)" ||
                          character.alignment === "混乱中立 (Chaotic Neutral)"))
                    ) && (
                      <>
                        <li>由背景经历塑造的世界观</li>
                        <li>在道德规范内解决问题的独特方式</li>
                        <li>基于阵营价值观做出重要决定</li>
                      </>
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-base-content/70 italic">
                  选择背景和阵营后将显示组合分析...
                </p>
              )}
            </div>

            {/* 背景故事展示区 */}
            <div
              id="background-story"
              className="bg-base-200 p-4 rounded-lg mt-4"
            >
              <h3 className="font-bold text-lg mb-2">
                {language === "chinese"
                  ? "角色背景故事"
                  : "Character Background Story"}
              </h3>

              {character.backgroundStory ? (
                <div className="prose prose-sm max-w-none">
                  {character.backgroundStory
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-2 text-sm">
                        {paragraph}
                      </p>
                    ))}
                </div>
              ) : (
                <p className="text-base-content/70 italic">
                  {language === "chinese"
                    ? "使用左侧的AI背景生成器创建你的角色故事..."
                    : "Use the AI Background Generator on the left to create your character's story..."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundStep;
