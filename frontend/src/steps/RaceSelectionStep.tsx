// steps/RaceSelectionStep.tsx

import React from "react";
import { Character, RACES, SUBRACES } from "../types/character";

interface RaceSelectionStepProps {
  character: Character;
  handleRaceChange: (race: string) => void;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const RaceSelectionStep: React.FC<RaceSelectionStepProps> = ({
  character,
  handleRaceChange,
  updateCharacter,
}) => {
  // Get race description
  const getRaceDescription = (race: string): string => {
    switch (race) {
      case "Human":
        return "Humans are the most common and adaptable race, with shorter lifespans but great ambition. They can find their place in any environment and society, making them natural adapters and innovators. In the game, humans get +1 to all ability scores, making them good choices for any class.";
      case "Elf":
        return "Elves are elegant, long-lived beings with deep connections to nature and magic. They are graceful, quick to react, and possess keen senses and exceptional dexterity. Elves have darkvision, +2 Dexterity, resistance to charm magic, and don't need sleep, only requiring 4 hours of meditation.";
      case "Dwarf":
        return "Dwarves are tough, stubborn underground dwellers known for their craftsmanship and combat prowess. They are physically strong, have remarkable endurance, and natural resistance to poison and certain magic. Dwarves have darkvision, +2 Constitution, poison resistance, weapon proficiencies, and can identify special features in stonework.";
      case "Halfling":
        return "Halflings are small but brave beings known for their agility and luck. They are friendly, adaptable, and possess remarkable luck and courage. Halflings get +2 Dexterity, can move through spaces of larger creatures, can reroll 1s on d20 rolls, and have advantage against fear effects.";
      case "Gnome":
        return "Gnomes are small beings known for their intelligence, creativity, and affinity for magic. They are naturally curious and love invention and exploration. Gnomes have darkvision, +2 Intelligence, advantage on magic saving throws, and can communicate with small animals.";
      case "Half-Elf":
        return "Half-Elves combine human adaptability with elven grace. They often find their place between cultures, making excellent diplomats and mediators. Half-Elves have darkvision, +2 Charisma, +1 to two other ability scores of choice, charm resistance, and gain two additional skill proficiencies.";
      case "Half-Orc":
        return "Half-Orcs combine human adaptability with orcish strength, making them natural warriors. They are physically strong, determined, and show remarkable resilience in adversity. Half-Orcs have darkvision, +2 Strength, +1 Constitution, Intimidation proficiency, and can deal extra damage on critical hits.";
      case "Tiefling":
        return "Tieflings have infernal bloodlines, possessing both supernatural charisma and often facing prejudice. They are intelligent and have innate arcane abilities. Tieflings have darkvision, +1 Intelligence, +2 Charisma, fire resistance, and can use some innate spellcasting abilities.";
      case "Dragonborn":
        return "Dragonborn have draconic bloodlines, possessing great physical strength and innate pride. They value family and tradition, making them natural leaders. Dragonborn get +2 Strength, +1 Charisma, damage resistance based on their ancestry, and a breath weapon ability.";
      default:
        return "Select a race to view its description and abilities.";
    }
  };

  // Get subrace description
  const getSubraceDescription = (race: string, subrace: string): string => {
    if (race === "Human") {
      if (subrace === "Standard") {
        return "Standard humans get +1 to all six ability scores, making them extremely balanced and suitable for almost any class.";
      } else if (subrace === "Variant") {
        return "Variant humans can increase two different ability scores by 1, gain proficiency in one skill, and receive one feat, offering more customization options. Requires DM permission.";
      }
    } else if (race === "Elf") {
      if (subrace === "High Elf") {
        return "High Elves focus on magical study, getting +1 Intelligence, an extra language, and a wizard cantrip. Suitable for wizards and other spellcasters.";
      } else if (subrace === "Wood Elf") {
        return "Wood Elves are closely connected to nature, getting +1 Wisdom, increased movement speed, and can attempt to hide in lightly obscured areas. Excellent for rangers and druids.";
      } else if (subrace === "Dark Elf") {
        return "Dark Elves (Drow) come from the Underdark, getting +1 Charisma, superior darkvision, and additional spellcasting abilities, but have sunlight sensitivity. Requires DM permission.";
      }
    } else if (race === "Dwarf") {
      if (subrace === "Hill Dwarf") {
        return "Hill Dwarves are more resilient, getting +1 Wisdom, increased hit points, and extra hit points per level. Suitable for clerics and druids.";
      } else if (subrace === "Mountain Dwarf") {
        return "Mountain Dwarves are excellent warriors, getting +2 Strength and proficiency with light and medium armor. Great for fighters and paladins.";
      }
    } else if (race === "Halfling") {
      if (subrace === "Lightfoot") {
        return "Lightfoot Halflings are more agile, getting +1 Charisma and can move through spaces of larger creatures. Suitable for rogues and bards.";
      } else if (subrace === "Stout") {
        return "Stout Halflings are more resilient, getting +1 Constitution, poison resistance, and advantage on poison saving throws. Good for any class needing survivability.";
      }
    } else if (race === "Gnome") {
      if (subrace === "Forest Gnome") {
        return "Forest Gnomes have natural magic talent, getting +1 Dexterity, a minor illusion cantrip, and can communicate with small beasts. Suitable for druids and bards.";
      } else if (subrace === "Rock Gnome") {
        return "Rock Gnomes are masters of invention and craftsmanship, getting +1 Constitution, tinker knowledge, and can create small mechanical devices. Good for wizards and artificers.";
      }
    } else if (race === "Half-Elf") {
      return "Half-Elves don't have official subraces, but they have great flexibility, being able to increase two different ability scores by 1 and gain two skill proficiencies.";
    } else if (race === "Half-Orc") {
      return "Half-Orcs don't have official subraces, but they are natural warriors with +2 Strength, +1 Constitution, and extraordinary resilience in combat.";
    } else if (race === "Tiefling") {
      return "Base Tiefling traits include darkvision, +1 Intelligence, +2 Charisma, fire resistance, and some innate spellcasting abilities. Some settings have variants with different infernal bloodlines.";
    } else if (race === "Dragonborn") {
      // Dragon type descriptions
      const dragonTypeDescriptions: Record<string, string> = {
        Black:
          "Black Dragon ancestry grants acid damage breath weapon and acid damage resistance.",
        Blue: "Blue Dragon ancestry grants lightning damage breath weapon and lightning damage resistance.",
        Green:
          "Green Dragon ancestry grants poison damage breath weapon and poison damage resistance.",
        Red: "Red Dragon ancestry grants fire damage breath weapon and fire damage resistance.",
        White:
          "White Dragon ancestry grants cold damage breath weapon and cold damage resistance.",
        Gold: "Gold Dragon ancestry grants fire damage breath weapon and fire damage resistance.",
        Silver:
          "Silver Dragon ancestry grants cold damage breath weapon and cold damage resistance.",
        Copper:
          "Copper Dragon ancestry grants acid damage breath weapon and acid damage resistance.",
        Bronze:
          "Bronze Dragon ancestry grants lightning damage breath weapon and lightning damage resistance.",
        Brass:
          "Brass Dragon ancestry grants fire damage breath weapon and fire damage resistance.",
      };

      return (
        dragonTypeDescriptions[subrace] ||
        "Different dragon ancestries provide different types of breath weapons and corresponding damage resistances."
      );
    }

    return "Select a subrace to view its traits and abilities.";
  };

  // Get race traits
  const getRaceTraits = (race: string): string[] => {
    switch (race) {
      case "Human":
        return [
          "Ability Score Increase: +1 to all ability scores",
          "Age: Reach adulthood in late teens, live less than 100 years",
          "Size: Medium",
          "Speed: 30 feet",
          "Languages: Common and one extra language",
        ];
      case "Elf":
        return [
          "Ability Score Increase: +2 Dexterity",
          "Age: Reach adulthood around 100, can live to 750",
          "Darkvision: 60 feet",
          "Keen Senses: Proficiency in Perception",
          "Fey Ancestry: Advantage on saving throws against being charmed, magic can't put you to sleep",
          "Trance: Don't need sleep, 4 hours of meditation equals 8 hours of sleep",
        ];
      case "Dwarf":
        return [
          "Ability Score Increase: +2 Constitution",
          "Age: Reach adulthood around 50, can live to 350+",
          "Darkvision: 60 feet",
          "Dwarven Resilience: Advantage on saving throws against poison, resistance to poison damage",
          "Dwarven Combat Training: Proficient with battleaxe, handaxe, light hammer, and warhammer",
          "Tool Proficiency: Proficient with one set of artisan's tools",
          "Stonecunning: Double proficiency bonus for Intelligence (History) checks related to stone",
        ];
      case "Halfling":
        return [
          "Ability Score Increase: +2 Dexterity",
          "Age: Reach adulthood around 20, typically live to 150",
          "Size: Small",
          "Speed: 25 feet",
          "Lucky: Reroll 1s on attack rolls, ability checks, or saving throws",
          "Brave: Advantage on saving throws against being frightened",
          "Nimble: Can move through the space of any creature that is of a size larger than yours",
        ];
      case "Gnome":
        return [
          "Ability Score Increase: +2 Intelligence",
          "Age: Reach adulthood around 40, can live to 350-500",
          "Size: Small",
          "Speed: 25 feet",
          "Darkvision: 60 feet",
          "Gnome Cunning: Advantage on Intelligence, Wisdom, and Charisma saving throws against magic",
        ];
      case "Half-Elf":
        return [
          "Ability Score Increase: +2 Charisma, +1 to two other ability scores of choice",
          "Age: Reach adulthood around 20, can live to 180+",
          "Darkvision: 60 feet",
          "Fey Ancestry: Advantage on saving throws against being charmed, magic can't put you to sleep",
          "Skill Versatility: Proficiency in two skills of your choice",
        ];
      case "Half-Orc":
        return [
          "Ability Score Increase: +2 Strength, +1 Constitution",
          "Age: Reach adulthood around 14, rarely live past 75",
          "Darkvision: 60 feet",
          "Menacing: Proficiency in Intimidation",
          "Relentless Endurance: When reduced to 0 HP but not killed, drop to 1 HP instead",
          "Savage Attacks: When scoring a critical hit, roll one of the weapon's damage dice one additional time",
        ];
      case "Tiefling":
        return [
          "Ability Score Increase: +1 Intelligence, +2 Charisma",
          "Age: Similar to humans, but slightly longer-lived",
          "Darkvision: 60 feet",
          "Hellish Resistance: Resistance to fire damage",
          "Infernal Legacy: Know the thaumaturgy cantrip, can cast hellish rebuke and darkness at higher levels",
        ];
      case "Dragonborn":
        return [
          "Ability Score Increase: +2 Strength, +1 Charisma",
          "Age: Reach adulthood around 15, live about 80 years",
          "Size: Medium, but taller than most humans",
          "Speed: 30 feet",
          "Draconic Ancestry: Choose a dragon type for damage resistance and breath weapon",
          "Breath Weapon: Deal 2d6 damage of your dragon type in a 15-foot cone",
        ];
      default:
        return [];
    }
  };

  // Get subrace traits
  const getSubraceTraits = (race: string, subrace: string): string[] => {
    if (race === "Human") {
      if (subrace === "Standard") {
        return ["+1 to all ability scores", "No additional traits"];
      } else if (subrace === "Variant") {
        return [
          "+1 to two different ability scores",
          "One skill proficiency",
          "One feat",
        ];
      }
    } else if (race === "Elf") {
      if (subrace === "High Elf") {
        return ["+1 Intelligence", "One wizard cantrip", "Extra language"];
      } else if (subrace === "Wood Elf") {
        return [
          "+1 Wisdom",
          "Increased movement speed to 35 feet",
          "Can attempt to hide when lightly obscured",
          "Better at surviving in forests",
        ];
      } else if (subrace === "Dark Elf") {
        return [
          "+1 Charisma",
          "Superior darkvision (120 feet)",
          "Sunlight sensitivity",
          "Additional spellcasting abilities",
        ];
      }
    } else if (race === "Dwarf") {
      if (subrace === "Hill Dwarf") {
        return [
          "+1 Wisdom",
          "Maximum hit points increased by 1",
          "Extra hit point per level",
        ];
      } else if (subrace === "Mountain Dwarf") {
        return ["+2 Strength", "Proficiency with light and medium armor"];
      }
    } else if (race === "Halfling") {
      if (subrace === "Lightfoot") {
        return ["+1 Charisma", "Can move through spaces of larger creatures"];
      } else if (subrace === "Stout") {
        return [
          "+1 Constitution",
          "Resistance to poison damage",
          "Advantage on saving throws against poison",
        ];
      }
    } else if (race === "Gnome") {
      if (subrace === "Forest Gnome") {
        return [
          "+1 Dexterity",
          "Minor illusion cantrip",
          "Speak with small beasts",
        ];
      } else if (subrace === "Rock Gnome") {
        return ["+1 Constitution", "Artificer's lore", "Tinker ability"];
      }
    }
    return [];
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Select Race</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-lg">Race</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={character.race}
                onChange={(e) => handleRaceChange(e.target.value)}
              >
                <option value="">Select a race</option>
                {RACES.map((race) => (
                  <option key={race} value={race}>
                    {race}
                  </option>
                ))}
              </select>
            </div>

            {character.race && SUBRACES[character.race]?.length > 0 && (
              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text text-lg">Subrace</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={character.subrace}
                  onChange={(e) => updateCharacter("subrace", e.target.value)}
                >
                  {SUBRACES[character.race].map((subrace) => (
                    <option key={subrace} value={subrace}>
                      {subrace}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {character.race && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Base Race Traits</h3>
                <ul className="space-y-1 text-sm">
                  {getRaceTraits(character.race).map((trait, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></div>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            {character.race ? (
              <>
                <h3 className="font-bold text-lg mb-2">{character.race}</h3>
                <p className="my-2 text-sm">
                  {getRaceDescription(character.race)}
                </p>

                {character.subrace && (
                  <div className="mt-6">
                    <h4 className="font-bold text-base mb-2">
                      {character.subrace} Subrace Traits
                    </h4>
                    <p className="text-sm mb-4">
                      {getSubraceDescription(character.race, character.subrace)}
                    </p>

                    <ul className="space-y-1 text-sm">
                      {getSubraceTraits(character.race, character.subrace).map(
                        (trait, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-secondary rounded-full mr-2 mt-1.5"></div>
                            <span>{trait}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-2">Race Introduction</h3>
                <p className="text-sm">
                  Race determines your character's appearance and certain
                  abilities in the game world. Each race has its unique physical
                  traits, cultural background, and game mechanics.
                </p>
                <p className="text-sm mt-2">Race selection affects:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Base ability score bonuses</li>
                  <li>• Special abilities (like darkvision)</li>
                  <li>• Additional skills and resistances</li>
                  <li>• Character appearance and cultural background</li>
                </ul>
                <p className="text-sm mt-4 italic text-base-content/70">
                  Select a race and subrace (if available) to view detailed
                  information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceSelectionStep;
