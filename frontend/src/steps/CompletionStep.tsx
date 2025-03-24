// steps/CompletionStep.tsx

import React from "react";
import { Character, calculateModifier } from "../types/character";

interface CompletionStepProps {
  character: Character;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ character }) => {
  // Calculate hit points
  const calculateHP = (): number => {
    const conModifier = calculateModifier(character.stats.constitution);

    if (character.characterClass === "Barbarian") {
      return 12 + conModifier;
    } else if (
      character.characterClass === "Fighter" ||
      character.characterClass === "Paladin" ||
      character.characterClass === "Ranger"
    ) {
      return 10 + conModifier;
    } else if (
      character.characterClass === "Sorcerer" ||
      character.characterClass === "Wizard"
    ) {
      return 6 + conModifier;
    } else {
      return 8 + conModifier;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">
          Character Creation Complete
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Portrait - First Column */}
          <div className="flex flex-col items-center">
            {character.portraitUrl ? (
              <img
                src={character.portraitUrl}
                alt={`${character.name}'s Portrait`}
                className="max-w-full rounded-lg shadow-lg border-2 border-primary max-h-96 object-contain mb-4"
              />
            ) : (
              <div className="bg-base-200 p-8 rounded-lg text-center w-full h-80 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 opacity-30">🧙</div>
                <p className="text-base-content/70">No portrait generated</p>
              </div>
            )}

            <div className="stats shadow mt-4 w-full">
              <div className="stat">
                <div className="stat-title">Hit Points</div>
                <div className="stat-value text-primary">{calculateHP()}</div>
                <div className="stat-desc">Based on class and constitution</div>
              </div>

              <div className="stat">
                <div className="stat-title">Armor Class</div>
                <div className="stat-value text-secondary">
                  {10 + calculateModifier(character.stats.dexterity)}
                </div>
                <div className="stat-desc">Base AC (unarmored)</div>
              </div>
            </div>

            <div className="stats shadow mt-2 w-full">
              <div className="stat">
                <div className="stat-title">Initiative</div>
                <div className="stat-value">
                  {calculateModifier(character.stats.dexterity) >= 0 ? "+" : ""}
                  {calculateModifier(character.stats.dexterity)}
                </div>
                <div className="stat-desc">Based on dexterity modifier</div>
              </div>

              <div className="stat">
                <div className="stat-title">Proficiency Bonus</div>
                <div className="stat-value">
                  +{2 + Math.floor((character.level - 1) / 4)}
                </div>
                <div className="stat-desc">Based on character level</div>
              </div>
            </div>
          </div>

          {/* Character Stats and Skills - Second Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Character Summary</h3>
            <div className="bg-base-200 p-4 rounded-lg shadow-sm">
              <p className="text-lg font-bold mb-2">
                {character.name || "Unnamed Character"}
              </p>
              <p>
                <span className="font-semibold">Level:</span> {character.level}{" "}
                {character.characterClass}
              </p>
              <p>
                <span className="font-semibold">Race:</span> {character.race}{" "}
                {character.subrace ? `(${character.subrace})` : ""}
              </p>
              <p>
                <span className="font-semibold">Background:</span>{" "}
                {character.background}
              </p>
              <p>
                <span className="font-semibold">Alignment:</span>{" "}
                {character.alignment}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {character.gender === "male"
                  ? "Male"
                  : character.gender === "female"
                  ? "Female"
                  : character.gender === "non-binary"
                  ? "Non-binary"
                  : "Unspecified"}
              </p>

              <div className="divider my-2"></div>

              <h4 className="font-bold mt-2 mb-2">Ability Scores</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(character.stats).map(([stat, value]) => (
                  <p key={stat}>
                    <strong className="capitalize">
                      {stat === "strength"
                        ? "Strength: "
                        : stat === "dexterity"
                        ? "Dexterity: "
                        : stat === "constitution"
                        ? "Constitution: "
                        : stat === "intelligence"
                        ? "Intelligence: "
                        : stat === "wisdom"
                        ? "Wisdom: "
                        : "Charisma: "}
                    </strong>
                    {value} ({calculateModifier(value) >= 0 ? "+" : ""}
                    {calculateModifier(value)})
                  </p>
                ))}
              </div>

              <h4 className="font-bold mt-4 mb-2">Skill Proficiencies</h4>
              <div className="flex flex-wrap gap-1">
                {character.skillProficiencies.length > 0 ? (
                  character.skillProficiencies.map((skill) => (
                    <span key={skill} className="badge badge-primary">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-base-content/70">
                    No skills selected
                  </span>
                )}
              </div>

              {character.features && character.features.length > 0 && (
                <>
                  <h4 className="font-bold mt-4 mb-2">Appearance Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {character.features.map((feature) => (
                      <span key={feature} className="badge badge-secondary">
                        {feature}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Background Story - Third Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Character Background</h3>
            {character.backgroundStory ? (
              <div className="bg-base-200 p-4 rounded-lg shadow-sm prose">
                {character.backgroundStory
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
              </div>
            ) : (
              <div className="bg-base-200 p-4 rounded-lg shadow-sm text-base-content/70">
                <p>No background story generated</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <div className="bg-base-200 p-4 rounded-lg shadow-sm">
                <p className="mb-4">
                  Your character is ready! Click the button below to save your
                  character and begin your adventure, or go back to modify any
                  part of your character.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Choose suitable equipment for your character</li>
                  <li>
                    Discuss your character's background with the Game Master
                  </li>
                  <li>
                    Consider your character's personality traits and motivations
                  </li>
                  <li>
                    Prepare your character sheet and start your adventure!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
