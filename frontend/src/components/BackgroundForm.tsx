import React, { useState } from "react";
import { generateCharacterBackground } from "../api/aigm";
import KeywordInput from "./KeywordInput";

interface BackgroundFormProps {
  onGenerated: (background: string) => void;
  onClose: () => void;
}

const BackgroundForm: React.FC<BackgroundFormProps> = ({
  onGenerated,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tone, setTone] = useState("balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Predefined options
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

  const tones = [
    "balanced",
    "heroic",
    "tragic",
    "comedic",
    "mysterious",
    "dark",
    "epic",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !race || !characterClass) {
      setError("Name, race, and class are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateCharacterBackground({
        name,
        race,
        class: characterClass,
        keywords: keywords,
        tone,
      });

      onGenerated(response.background);
      onClose();
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
    <div className="p-6 bg-base-100 rounded-lg shadow-lg border border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">
          Generate Character Background
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
            <label className="label">Character Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter character name"
              required
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
            <label className="label">Story Tone</label>
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

          <div className="form-control md:col-span-2">
            <label className="label">Keywords</label>
            <KeywordInput value={keywords} onChange={setKeywords} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
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
              "Generate Background"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackgroundForm;
