// steps/SkillsStep.tsx

import React, { useState, useEffect } from "react";
import { SKILLS } from "../types/character";

interface SkillsStepProps {
  skillProficiencies: string[];
  toggleSkill: (skill: string) => void;
  characterClass: string;
  background: string;
}

const SkillsStep: React.FC<SkillsStepProps> = ({
  skillProficiencies,
  toggleSkill,
  characterClass,
  background,
}) => {
  // Store class and background skill options
  const [classSkillOptions, setClassSkillOptions] = useState<string[]>([]);

  // Number of skills allowed by class
  const [classSkillCount, setClassSkillCount] = useState(0);
  // Fixed skills granted by background
  const [backgroundSkills, setBackgroundSkills] = useState<string[]>([]);

  // Track selected class skills count
  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>([]);

  // Update available skills when class or background changes
  useEffect(() => {
    // Reset selected skills state
    setSelectedClassSkills([]);

    // Set available skills and count based on class
    switch (characterClass) {
      case "Fighter":
        setClassSkillOptions([
          "Acrobatics",
          "Animal Handling",
          "Athletics",
          "History",
          "Insight",
          "Intimidation",
          "Perception",
          "Survival",
        ]);
        setClassSkillCount(2);
        break;
      case "Wizard":
        setClassSkillOptions([
          "Arcana",
          "History",
          "Insight",
          "Investigation",
          "Medicine",
          "Religion",
        ]);
        setClassSkillCount(2);
        break;
      case "Rogue":
        setClassSkillOptions([
          "Acrobatics",
          "Athletics",
          "Deception",
          "Insight",
          "Intimidation",
          "Investigation",
          "Perception",
          "Performance",
          "Persuasion",
          "Sleight of Hand",
          "Stealth",
        ]);
        setClassSkillCount(4);
        break;
      case "Cleric":
        setClassSkillOptions([
          "History",
          "Insight",
          "Medicine",
          "Persuasion",
          "Religion",
        ]);
        setClassSkillCount(2);
        break;
      case "Barbarian":
        setClassSkillOptions([
          "Animal Handling",
          "Athletics",
          "Intimidation",
          "Nature",
          "Perception",
          "Survival",
        ]);
        setClassSkillCount(2);
        break;
      default:
        setClassSkillOptions(SKILLS);
        setClassSkillCount(2);
    }

    // 设置背景提供的技能
    switch (background) {
      case "Acolyte":
        setBackgroundSkills(["Insight", "Religion"]);
        break;
      case "Criminal":
        setBackgroundSkills(["Deception", "Stealth"]);
        break;
      case "Folk Hero":
        setBackgroundSkills(["Animal Handling", "Survival"]);
        break;
      case "Noble":
        setBackgroundSkills(["History", "Persuasion"]);
        break;
      case "Sage":
        setBackgroundSkills(["Arcana", "History"]);
        break;
      case "Soldier":
        setBackgroundSkills(["Athletics", "Intimidation"]);
        break;
      case "Urchin":
        setBackgroundSkills(["Sleight of Hand", "Stealth"]);
        break;
      case "Entertainer":
        setBackgroundSkills(["Acrobatics", "Performance"]);
        break;
      case "Guild Artisan":
        setBackgroundSkills(["Insight", "Persuasion"]);
        break;
      default:
        setBackgroundSkills([]);
    }
  }, [characterClass, background]);

  // Handle skill selection
  const handleSkillToggle = (skill: string) => {
    // If skill is from background, do nothing
    if (backgroundSkills.includes(skill)) return;

    // If skill is already selected, remove it
    if (skillProficiencies.includes(skill)) {
      toggleSkill(skill);
      if (classSkillOptions.includes(skill)) {
        setSelectedClassSkills(selectedClassSkills.filter((s) => s !== skill));
      }
      return;
    }

    // If skill is not selectable, do nothing
    if (!isSkillSelectable(skill)) return;

    // Add the skill
    toggleSkill(skill);
    if (classSkillOptions.includes(skill)) {
      setSelectedClassSkills([...selectedClassSkills, skill]);
    }
  };

  // Check if a skill can be selected
  const isSkillSelectable = (skill: string) => {
    // If skill is from background, it's always selected
    if (backgroundSkills.includes(skill)) return false;

    // If skill is already selected, it can be deselected
    if (skillProficiencies.includes(skill)) return true;

    // If not a class skill option, it can't be selected
    if (!classSkillOptions.includes(skill)) return false;

    // Check if we've reached the class skill limit
    const selectedClassSkillCount = selectedClassSkills.length;
    return selectedClassSkillCount < classSkillCount;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Select Skills</h2>
        <p className="mb-4">
          {characterClass && background ? (
            <>
              Your {characterClass} class allows you to choose {classSkillCount}{" "}
              skills. Your {background} background grants you proficiency in{" "}
              {backgroundSkills.join(" and ")}.
            </>
          ) : (
            "Select a class and background to view available skills."
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {SKILLS.map((skill) => {
            const isFromBackground = backgroundSkills.includes(skill);
            const isSelected = skillProficiencies.includes(skill);
            const isDisabled = !isSkillSelectable(skill);

            return (
              <div key={skill} className="form-control">
                <label
                  className={`label cursor-pointer justify-start gap-2 ${
                    isDisabled && !isSelected ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className={`checkbox ${
                      isFromBackground
                        ? "checkbox-secondary"
                        : "checkbox-primary"
                    }`}
                    checked={isSelected}
                    onChange={() => handleSkillToggle(skill)}
                    disabled={isDisabled && !isSelected}
                  />
                  <span className="label-text">
                    {skill}
                    {isFromBackground && (
                      <span className="text-xs text-secondary">
                        {" "}
                        (Background)
                      </span>
                    )}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;
