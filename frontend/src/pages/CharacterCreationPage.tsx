//import React from 'react'
// src/pages/CharacterCreationPage.tsx
import { useState } from "react";

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

const CharacterCreationPage = () => {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState<CharacterStats>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });

  const races = [
    "Human",
    "Elf",
    "Dwarf",
    "Halfling",
    "Gnome",
    "Half-Elf",
    "Half-Orc",
    "Tiefling",
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

  const handleStatChange = (stat: keyof CharacterStats, value: number) => {
    if (value >= 3 && value <= 18) {
      setStats((prev) => ({
        ...prev,
        [stat]: value,
      }));
    }
  };

  const calculateModifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };

  const saveCharacter = () => {
    const character = {
      name,
      race,
      class: characterClass,
      level,
      stats,
    };

    console.log("Saving character:", character);
    // 这里可以添加API调用，保存角色到后端
    alert("角色已保存!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">创建角色</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>

          <div className="form-control mb-4">
            <label className="label">角色名称</label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入角色名称"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">种族</label>
            <select
              className="select select-bordered w-full"
              value={race}
              onChange={(e) => setRace(e.target.value)}
            >
              <option value="">选择种族</option>
              {races.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">职业</label>
            <select
              className="select select-bordered w-full"
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
            >
              <option value="">选择职业</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">等级</label>
            <input
              type="number"
              className="input input-bordered"
              value={level}
              min={1}
              max={20}
              onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="bg-base-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">能力值</h2>

          {Object.entries(stats).map(([stat, value]) => (
            <div key={stat} className="form-control mb-2">
              <label className="label capitalize">{stat}</label>
              <div className="flex items-center">
                <button
                  className="btn btn-sm btn-circle"
                  onClick={() =>
                    handleStatChange(stat as keyof CharacterStats, value - 1)
                  }
                  disabled={value <= 3}
                >
                  -
                </button>
                <input
                  type="number"
                  className="input input-bordered mx-2 w-20 text-center"
                  value={value}
                  onChange={(e) =>
                    handleStatChange(
                      stat as keyof CharacterStats,
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <button
                  className="btn btn-sm btn-circle"
                  onClick={() =>
                    handleStatChange(stat as keyof CharacterStats, value + 1)
                  }
                  disabled={value >= 18}
                >
                  +
                </button>
                <span className="ml-4">
                  调整值: {calculateModifier(value) >= 0 ? "+" : ""}
                  {calculateModifier(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="btn btn-primary btn-lg"
          onClick={saveCharacter}
          disabled={!name || !race || !characterClass}
        >
          保存角色
        </button>
      </div>
    </div>
  );
};

export default CharacterCreationPage;
