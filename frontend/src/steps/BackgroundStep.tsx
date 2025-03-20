// steps/BackgroundStep.tsx

import React from "react";
import { Character, BACKGROUNDS, ALIGNMENTS } from "../types/character";

interface BackgroundStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const BackgroundStep: React.FC<BackgroundStepProps> = ({
  character,
  updateCharacter,
}) => {
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
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
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
              </>
            ) : (
              <p className="text-gray-500 italic">选择一个背景查看其特性...</p>
            )}

            {!character.background && !character.alignment && (
              <div className="mt-4">
                <h4 className="font-semibold">背景的重要性</h4>
                <p className="mt-2 text-sm">
                  背景描述了你的角色在成为冒险者之前的生活经历。它为你的角色提供了重要的故事元素，以及与技能、语言和装备相关的游戏优势。
                </p>

                <h4 className="font-semibold mt-4">阵营说明</h4>
                <p className="mt-2 text-sm">
                  阵营是对角色道德和伦理立场的广泛描述，代表了他们如何与世界互动，以及他们的价值观和行为准则。阵营不是固定不变的，而是可能随着角色经历而发展变化。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundStep;
