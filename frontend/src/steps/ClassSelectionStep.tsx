// steps/ClassSelectionStep.tsx

import React from "react";
import { Character, CLASSES } from "../types/character";

interface ClassSelectionStepProps {
  character: Character;
  updateCharacter: (className: string) => void;
}

const ClassSelectionStep: React.FC<ClassSelectionStepProps> = ({
  character,
  updateCharacter,
}) => {
  // 获取职业描述
  const getClassDescription = (className: string): string => {
    switch (className) {
      case "Fighter":
        return "Fighters are masters of martial combat, skilled with weapons and armor. They excel in physical combat and can specialize in various fighting styles.";
      case "Wizard":
        return "Wizards are powerful spellcasters who learn magic through study and practice. They have access to the largest spell list and can specialize in different schools of magic.";
      case "Rogue":
        return "Rogues are stealthy and skilled at dealing precise damage. They excel at sneaking, lockpicking, and finding and disarming traps.";
      case "Cleric":
        return "Clerics are divine spellcasters who draw power from their deity. They can heal, buff allies, and wield divine magic to protect and support their party.";
      case "Barbarian":
        return "Barbarians are fierce warriors who channel their rage into combat power. They are tough, mobile, and can deal massive damage in battle.";
      case "Bard":
        return "Bards are versatile performers who use music and magic to inspire allies and hinder enemies. They can heal, buff, debuff, and deal damage.";
      case "Druid":
        return "Druids are nature spellcasters who can shapeshift into animals and control natural forces. They can heal, buff, and use nature magic to protect the environment.";
      case "Monk":
        return "Monks are martial artists who combine physical training with mystical energy. They are fast, mobile, and can perform extraordinary feats of agility.";
      case "Paladin":
        return "Paladins are holy warriors who combine martial prowess with divine magic. They can heal, buff, and smite enemies with divine power.";
      case "Ranger":
        return "Rangers are skilled hunters and trackers who combine martial abilities with nature magic. They excel at ranged combat and wilderness survival.";
      case "Sorcerer":
        return "Sorcerers are innate spellcasters who draw power from their bloodline. They have fewer spells but can cast them more flexibly.";
      case "Warlock":
        return "Warlocks are powerful spellcasters who draw power from a pact with a deity or other entity. They can cast powerful spells and summon creatures to aid them.";
      default:
        return "Select a class to view its description and features.";
    }
  };

  // 获取职业的主要特性
  const getClassFeatures = (className: string): string[] => {
    switch (className) {
      case "Fighter":
        return [
          "Hit Dice: d10",
          "Feature Choices: Fighting Style, Combat Maneuvers, Extra Attack",
          "Primary Ability: Strength or Dexterity",
          "Armor Proficiencies: All",
          "Weapon Proficiencies: All",
          "Saving Throw Proficiencies: Strength, Constitution",
        ];
      case "Wizard":
        return [
          "Hit Dice: d6",
          "Feature Choices: Arcane Tradition, Spellbook, Arcane Recovery",
          "Primary Ability: Intelligence",
          "Armor Proficiencies: None",
          "Weapon Proficiencies: Dagger, Dart, Sling, Light Crossbow, Longbow",
          "Saving Throw Proficiencies: Intelligence, Wisdom",
        ];
      case "Rogue":
        return [
          "Hit Dice: d8",
          "Feature Choices: Expertise, Sneak Attack, Cunning Action",
          "Primary Ability: Dexterity",
          "Armor Proficiencies: Light",
          "Weapon Proficiencies: Simple Weapons, Light Crossbow, Longsword, Rapier, Shortsword",
          "Saving Throw Proficiencies: Dexterity, Intelligence",
        ];
      case "Cleric":
        return [
          "Hit Dice: d8",
          "Feature Choices: Divine Domain, Channel Divinity, Divine Intervention",
          "Primary Ability: Wisdom",
          "Armor Proficiencies: Light, Medium, Shields",
          "Weapon Proficiencies: Simple Weapons",
          "Saving Throw Proficiencies: Wisdom, Charisma",
        ];
      case "Barbarian":
        return [
          "Hit Dice: d12",
          "Feature Choices: Rage, Unarmored Defense, Primal Path",
          "Primary Ability: Strength",
          "Armor Proficiencies: Light, Medium, Shields",
          "Weapon Proficiencies: Simple Weapons, Martial Weapons",
          "Saving Throw Proficiencies: Strength, Constitution",
        ];
      case "Bard":
        return [
          "Hit Dice: d8",
          "Feature Choices: Bard College, Bardic Inspiration, Magical Secrets",
          "Primary Ability: Charisma",
          "Armor Proficiencies: Light",
          "Weapon Proficiencies: Simple Weapons, Light Crossbow, Longsword, Rapier, Shortsword",
          "Saving Throw Proficiencies: Dexterity, Charisma",
        ];
      case "Druid":
        return [
          "Hit Dice: d8",
          "Feature Choices: Druid Circle, Wild Shape, Natural Recovery",
          "Primary Ability: Wisdom",
          "Armor Proficiencies: Light, Medium (non-metal), Shields (non-metal)",
          "Weapon Proficiencies: Dagger, Dart, Sling, Quarterstaff, Spear, Light Hammer, Sickle, Scimitar",
          "Saving Throw Proficiencies: Intelligence, Wisdom",
        ];
      case "Monk":
        return [
          "Hit Dice: d8",
          "Feature Choices: Monastic Tradition, Ki, Flurry of Blows",
          "Primary Ability: Dexterity, Wisdom",
          "Armor Proficiencies: None",
          "Weapon Proficiencies: Simple Weapons, Shortsword",
          "Saving Throw Proficiencies: Strength, Dexterity",
        ];
      case "Paladin":
        return [
          "Hit Dice: d10",
          "Feature Choices: Sacred Oath, Divine Smite, Divine Spellcasting",
          "Primary Ability: Strength, Charisma",
          "Armor Proficiencies: All",
          "Weapon Proficiencies: All",
          "Saving Throw Proficiencies: Wisdom, Charisma",
        ];
      case "Ranger":
        return [
          "Hit Dice: d10",
          "Feature Choices: Favored Enemy, Natural Explorer, Ranger Archetype",
          "Primary Ability: Dexterity, Wisdom",
          "Armor Proficiencies: Light, Medium, Shields",
          "Weapon Proficiencies: Simple Weapons, Martial Weapons",
          "Saving Throw Proficiencies: Strength, Dexterity",
        ];
      case "Sorcerer":
        return [
          "Hit Dice: d6",
          "Feature Choices: Sorcerous Origin, Spell Points, Metamagic",
          "Primary Ability: Charisma",
          "Armor Proficiencies: None",
          "Weapon Proficiencies: Dagger, Dart, Sling, Longbow, Light Crossbow",
          "Saving Throw Proficiencies: Constitution, Charisma",
        ];
      case "Warlock":
        return [
          "Hit Dice: d8",
          "Feature Choices: Pact Master, Pact Boon, Pact Magic",
          "Primary Ability: Charisma",
          "Armor Proficiencies: Light",
          "Weapon Proficiencies: Simple Weapons",
          "Saving Throw Proficiencies: Wisdom, Charisma",
        ];
      default:
        return [];
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Select Class</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">Class</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.characterClass}
                onChange={(e) => updateCharacter(e.target.value)}
              >
                <option value="">Select a class</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {character.characterClass && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Class Features</h3>
                <ul className="space-y-1 text-sm">
                  {getClassFeatures(character.characterClass).map(
                    (feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></div>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {character.characterClass ? (
              <>
                <h3 className="font-bold text-lg mb-2">
                  {character.characterClass}
                </h3>
                <p className="my-2 text-sm">
                  {getClassDescription(character.characterClass)}
                </p>
                <div className="mt-4 text-sm">
                  <p className="italic text-base-content/80">
                    Class selection is a core decision in character building,
                    determining your combat style, abilities, and role in the
                    party.
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-2">Class Introduction</h3>
                <p className="text-base-content text-sm">
                  A class represents your character's profession and training in
                  the world of adventure. Each class offers unique abilities,
                  features, and playstyles.
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  <li>
                    🗡️{" "}
                    <span className="font-semibold">
                      Fighter, Barbarian, Paladin
                    </span>{" "}
                    - Masters of melee combat and damage
                  </li>
                  <li>
                    🏹 <span className="font-semibold">Ranger, Rogue</span> -
                    Experts in ranged combat and skills
                  </li>
                  <li>
                    ✨{" "}
                    <span className="font-semibold">
                      Wizard, Sorcerer, Warlock
                    </span>{" "}
                    - Powerful arcane spellcasters
                  </li>
                  <li>
                    🌟 <span className="font-semibold">Cleric, Druid</span> -
                    Divine and nature magic wielders
                  </li>
                  <li>
                    🎵 <span className="font-semibold">Bard</span> - Versatile
                    performers and support specialists
                  </li>
                  <li>
                    👊 <span className="font-semibold">Monk</span> - Martial
                    artists harnessing ki energy
                  </li>
                </ul>
                <p className="mt-4 italic text-base-content/80">
                  Choose a class that best matches your character concept and
                  desired playstyle.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelectionStep;
