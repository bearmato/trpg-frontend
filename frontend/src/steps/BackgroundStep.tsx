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

  const languages = ["english", "chinese"];

  // Get background description
  const getBackgroundDescription = (backgroundName: string): string => {
    switch (backgroundName) {
      case "Acolyte":
        return "As an acolyte, you spent your life in a temple or monastery, learning traditions, rituals, and prayers. You have the Shelter of the Faithful feature, allowing you to receive food and lodging from religious organizations of your faith. You are proficient in Insight and Religion skills, and learn two additional languages.";
      case "Criminal":
        return "As a criminal, you lived by breaking the law. You have a reliable criminal contact who can provide information and underground network connections. You are proficient in Deception and Stealth skills, as well as thieves' tools and one type of gaming set.";
      case "Folk Hero":
        return "As a folk hero, you became famous through a heroic deed. Common folk will help and shelter you when possible. You are proficient in Animal Handling and Survival skills, as well as one type of artisan's tools and land vehicles.";
      case "Noble":
        return "As a noble, you were born into or invited to high society. You have privileged status and are treated favorably in high society. You are proficient in History and Persuasion skills, one type of gaming set, and learn an additional language.";
      case "Sage":
        return "As a sage, you devoted your life to knowledge and research. When you don't know information, you usually know where to find it. You are proficient in Arcana and History skills, and learn two additional languages.";
      case "Soldier":
        return "As a soldier, you served in a military force or mercenary company. You have a military rank and influence among your former comrades. You are proficient in Athletics and Intimidation skills, as well as one type of gaming set and land vehicles.";
      case "Urchin":
        return "As an urchin, you grew up on city streets. You know secret passages through urban areas, allowing faster travel. You are proficient in Sleight of Hand and Stealth skills, as well as thieves' tools and disguise kit.";
      case "Entertainer":
        return "As an entertainer, you live by performing. You have fans in certain places, gaining free lodging and performance opportunities. You are proficient in Acrobatics and Performance skills, as well as disguise kit and one musical instrument.";
      case "Guild Artisan":
        return "As a guild artisan, you are skilled in a particular craft. Guild members provide various support and assistance. You are proficient in Insight and Persuasion skills, one type of artisan's tools, and learn an additional language.";
      default:
        return "Select a background to view its features and skill proficiencies.";
    }
  };

  // Get alignment description
  const getAlignmentDescription = (alignmentName: string): string => {
    switch (alignmentName) {
      case "Lawful Good":
        return "Lawful Good characters believe in rules and good behavior. They respect authority, protect the weak, and fight evil while following laws and traditions. Such characters might be loyal knights or just judges.";
      case "Neutral Good":
        return "Neutral Good characters focus on doing good without much concern for rules. They do what brings the most good, regardless of laws. Such characters might be healers or philanthropists.";
      case "Chaotic Good":
        return "Chaotic Good characters follow their own moral code, valuing personal freedom and good deeds. They resist oppression and disregard rules for the greater good. They might be noble outlaws or free thinkers.";
      case "Lawful Neutral":
        return "Lawful Neutral characters believe order and rules are paramount, without favoring good or evil. They follow the letter of the law. Such characters might be impartial judges or loyal soldiers.";
      case "True Neutral":
        return "True Neutral characters seek balance, avoid extremes, or focus on their own affairs. They make practical decisions based on circumstances. Such characters might be druids or pragmatists.";
      case "Chaotic Neutral":
        return "Chaotic Neutral characters value freedom and impulse, without deliberately doing good or evil. They maximize freedom and scorn rules. Such characters might be free-spirited artists or unbound wanderers.";
      case "Lawful Evil":
        return "Lawful Evil characters methodically pursue evil goals while maintaining a code of honor. They use rules for personal gain. Such characters might be tyrants or organized criminals.";
      case "Neutral Evil":
        return "Neutral Evil characters pursue self-interest without principles, disregarding others. They do whatever it takes to get what they want. Such characters might be cold-blooded killers or pure opportunists.";
      case "Chaotic Evil":
        return "Chaotic Evil characters are driven by violent and cruel impulses, scorning rules and others' well-being. They are dangerous and unpredictable. Such characters might be madmen or sadists.";
      default:
        return "Select an alignment to understand its values and behavioral code.";
    }
  };

  // Generate background with AI
  const handleGenerateBackground = async () => {
    if (!character.name || !character.race || !character.characterClass) {
      setError(
        "Please fill in character name, race, and class before generating background story"
      );
      return;
    }

    if (!character.background) {
      setError("Please select a character background");
      return;
    }

    if (!character.alignment) {
      setError("Please select a character alignment");
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

      // Update character background story
      updateCharacter("backgroundStory", response.background);

      // Show success message
      setSuccessMessage("Background story generated successfully!");

      // Scroll to background story area
      setTimeout(() => {
        const storyElement = document.getElementById("background-story");
        if (storyElement) {
          storyElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
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
        <h2 className="card-title text-2xl mb-6">
          Select Background and Alignment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">Background</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.background}
                onChange={(e) => updateCharacter("background", e.target.value)}
              >
                <option value="">Select a background</option>
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
                <span className="label-text text-lg">Alignment</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.alignment}
                onChange={(e) => updateCharacter("alignment", e.target.value)}
              >
                <option value="">Select an alignment</option>
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

            {/* AI Background Generator */}
            <div className="p-4 bg-base-200 rounded-lg border border-base-200/30">
              <h3 className="font-bold text-lg mb-3">
                AI Background Generator
              </h3>
              <p className="text-sm mb-4">
                Use AI to generate a D&D-compliant character background story
                based on your chosen background, alignment, and other details.
              </p>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Story Tone</span>
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

              {/* Language Selection */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Language</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Keywords (Optional)</span>
                </label>
                <KeywordInput value={keywords} onChange={setKeywords} />
                <label className="label">
                  <span className="label-text-alt">
                    Add keywords to influence the story generation
                  </span>
                </label>
              </div>

              <button
                className={`btn btn-primary w-full ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handleGenerateBackground}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Background Story"}
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

              {successMessage && (
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
                    <label>{successMessage}</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Background Story Display */}
          <div className="bg-base-200 p-4 rounded-lg" id="background-story">
            <h3 className="font-bold text-lg mb-3">Background Story</h3>
            {character.backgroundStory ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">
                  {character.backgroundStory}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Generate a background story using the AI generator, or write
                your own story here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundStep;
