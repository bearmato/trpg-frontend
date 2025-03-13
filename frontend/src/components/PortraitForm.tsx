import React, { useState, useEffect } from "react";
import { generateCharacterPortrait } from "../api/aigm";
import KeywordInput from "./KeywordInput";
import { CharacterData } from "../types/character";

interface PortraitFormProps {
  onGenerated: (portraitUrl: string) => void;
  onClose: () => void;
  initialData?: CharacterData;
  onSaveCharacter?: (data: CharacterData) => void;
  openBackgroundDialog?: () => void;
}

const PortraitForm: React.FC<PortraitFormProps> = ({
  onGenerated,
  onClose,
  initialData,
  onSaveCharacter,
  openBackgroundDialog,
}) => {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [gender, setGender] = useState("male");
  const [style, setStyle] = useState("fantasy");
  const [features, setFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showContinueOptions, setShowContinueOptions] = useState(false);

  // 预定义选项
  const races = [
    "Human",
    "Elf",
    "Dwarf",
    "Halfling",
    "Gnome",
    "Half-Elf",
    "Half-Orc",
    "Tiefling",
    "Dragonborn",
  ];

  const classes = [
    "Fighter",
    "Wizard",
    "Rogue",
    "Cleric",
    "Ranger",
    "Paladin",
    "Bard",
    "Druid",
    "Monk",
    "Sorcerer",
    "Warlock",
    "Barbarian",
  ];

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

  // 初始化数据
  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.race) setRace(initialData.race);
      if (initialData.class) setCharacterClass(initialData.class);
      if (initialData.gender) setGender(initialData.gender);
      if (initialData.features) setFeatures(initialData.features);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!race || !characterClass) {
      setError("Race and class are required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setShowContinueOptions(false);

    try {
      const response = await generateCharacterPortrait({
        name,
        race,
        class: characterClass,
        gender,
        style,
        features,
      });

      // 保存角色数据
      if (onSaveCharacter) {
        onSaveCharacter({
          name,
          race,
          class: characterClass,
          gender,
          features,
          portraitUrl: response.image_url,
        });
      }

      onGenerated(response.image_url);

      // 如果已经有背景信息，直接关闭
      if (initialData?.background) {
        onClose();
      }
      // 如果没有背景但有背景生成功能，显示继续选项
      else if (openBackgroundDialog) {
        setSuccessMessage(
          "Portrait generated successfully! Would you like to create a matching background story?"
        );
        setShowContinueOptions(true);
      }
      // 其他情况直接关闭
      else {
        onClose();
      }
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
    <div className="p-6 bg-base-100 rounded-lg shadow-lg border border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">
          Generate Character Portrait
        </h2>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          ✕
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-5 w-5"
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">Character Name (Optional)</label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter character name"
            />
          </div>

          <div className="form-control">
            <label className="label">Race</label>
            <select
              className="select select-bordered w-full"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              required
            >
              <option value="">Select Race</option>
              {races.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">Class</label>
            <select
              className="select select-bordered w-full"
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
              required
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">Gender</label>
            <select
              className="select select-bordered w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">Art Style</label>
            <select
              className="select select-bordered w-full"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">Character Features</label>
            <KeywordInput
              value={features}
              onChange={setFeatures}
              suggestions={featureSuggestions}
            />
          </div>
        </div>

        {showContinueOptions ? (
          <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/30">
            <p className="text-success font-medium mb-2">{successMessage}</p>
            <p className="text-success/80 text-sm mb-4">
              Your portrait has been generated and added to the chat.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Close
              </button>
              {openBackgroundDialog && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    openBackgroundDialog();
                  }}
                >
                  Generate Background Story
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : (
                "Generate Portrait"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PortraitForm;
