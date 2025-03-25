import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCharacterById } from "../api/characters";
import { calculateModifier } from "../types/character";
import { useAuth } from "../contexts/AuthContext";

interface CharacterDetail {
  id: string;
  name: string;
  race: string;
  subrace: string;
  character_class: string;
  subclass: string;
  level: number;
  background: string;
  alignment: string;
  gender: string;
  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  // Lists
  skill_proficiencies: string[];
  features: string[];
  // Background story
  background_story: string;
  personality: string;
  ideal: string;
  bond: string;
  flaw: string;
  // Portrait
  portrait_url: string;
  // Metadata
  created_at: string;
  updated_at: string;
}

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 加载角色详情
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/character-library/${id}` } });
      return;
    }

    const fetchCharacterDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await getCharacterById(id);
        setCharacter(data);
      } catch (err) {
        console.error("Failed to fetch character details:", err);
        setError("Failed to load character details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [id, isAuthenticated, navigate]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // 计算生命值
  const calculateHP = (
    characterClass: string,
    constitution: number
  ): number => {
    const conModifier = calculateModifier(constitution);

    if (characterClass === "Barbarian") {
      return 12 + conModifier;
    } else if (
      characterClass === "Fighter" ||
      characterClass === "Paladin" ||
      characterClass === "Ranger"
    ) {
      return 10 + conModifier;
    } else if (characterClass === "Sorcerer" || characterClass === "Wizard") {
      return 6 + conModifier;
    } else {
      return 8 + conModifier;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
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
          <span>{error || "Character not found"}</span>
        </div>
        <div className="mt-4">
          <Link to="/character-library" className="btn btn-primary">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-16">
      <div className="mb-6">
        <Link to="/character-library" className="btn btn-ghost btn-sm">
          ← Back to Library
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Character Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Character Portrait */}
            <div className="md:w-1/3">
              {character.portrait_url ? (
                <img
                  src={character.portrait_url}
                  alt={`${character.name}'s portrait`}
                  className="rounded-lg shadow-md w-full max-h-96 object-cover"
                />
              ) : (
                <div className="bg-base-200 rounded-lg h-80 flex items-center justify-center">
                  <span className="text-8xl opacity-30">🧙</span>
                </div>
              )}
            </div>

            {/* Character Info */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
              <p className="text-lg mb-4">
                Level {character.level} {character.race}{" "}
                {character.subrace ? `(${character.subrace})` : ""}{" "}
                {character.character_class}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                <div>
                  <span className="font-bold">Background:</span>{" "}
                  {character.background}
                </div>
                <div>
                  <span className="font-bold">Alignment:</span>{" "}
                  {character.alignment}
                </div>
                <div>
                  <span className="font-bold">Gender:</span> {character.gender}
                </div>
              </div>

              {/* Character Stats */}
              <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div className="stat">
                  <div className="stat-title">Hit Points</div>
                  <div className="stat-value text-primary">
                    {calculateHP(
                      character.character_class,
                      character.constitution
                    )}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Armor Class</div>
                  <div className="stat-value">
                    {10 + calculateModifier(character.dexterity)}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Initiative</div>
                  <div className="stat-value">
                    {calculateModifier(character.dexterity) >= 0 ? "+" : ""}
                    {calculateModifier(character.dexterity)}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Proficiency</div>
                  <div className="stat-value">
                    +{2 + Math.floor((character.level - 1) / 4)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for different sections */}
          <div className="tabs tabs-boxed mb-4">
            <a
              className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Character Details
            </a>
            <a
              className={`tab ${activeTab === "abilities" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("abilities")}
            >
              Abilities & Skills
            </a>
            <a
              className={`tab ${
                activeTab === "background" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("background")}
            >
              Background Story
            </a>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Character Information
                  </h2>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p>
                      <span className="font-bold">Name:</span> {character.name}
                    </p>
                    <p>
                      <span className="font-bold">Race:</span> {character.race}{" "}
                      {character.subrace ? `(${character.subrace})` : ""}
                    </p>
                    <p>
                      <span className="font-bold">Class:</span>{" "}
                      {character.character_class}{" "}
                      {character.subclass ? `(${character.subclass})` : ""}
                    </p>
                    <p>
                      <span className="font-bold">Level:</span>{" "}
                      {character.level}
                    </p>
                    <p>
                      <span className="font-bold">Background:</span>{" "}
                      {character.background}
                    </p>
                    <p>
                      <span className="font-bold">Alignment:</span>{" "}
                      {character.alignment}
                    </p>
                    <p>
                      <span className="font-bold">Gender:</span>{" "}
                      {character.gender}
                    </p>
                  </div>

                  {character.features && character.features.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-bold text-lg mb-2">
                        Appearance Features
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {character.features.map((feature, index) => (
                          <span key={index} className="badge badge-secondary">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-sm text-base-content/70">
                    <p>Created: {formatDate(character.created_at)}</p>
                    <p>Last Updated: {formatDate(character.updated_at)}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-2">Character Preview</h2>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="italic mb-4">
                      {character.name} is a level {character.level}{" "}
                      {character.race} {character.character_class} with a{" "}
                      {character.background} background.
                    </p>

                    {character.background_story ? (
                      <div>
                        <h3 className="font-bold">Background Summary:</h3>
                        <p className="mt-2">
                          {character.background_story.length > 200
                            ? character.background_story.substring(0, 200) +
                              "..."
                            : character.background_story}
                        </p>
                      </div>
                    ) : (
                      <p>No background story available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Abilities Tab */}
            {activeTab === "abilities" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Ability Scores</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Strength</div>
                      <div className="stat-value">{character.strength}</div>
                      <div className="stat-desc">
                        Modifier:{" "}
                        {calculateModifier(character.strength) >= 0 ? "+" : ""}
                        {calculateModifier(character.strength)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Dexterity</div>
                      <div className="stat-value">{character.dexterity}</div>
                      <div className="stat-desc">
                        Modifier:{" "}
                        {calculateModifier(character.dexterity) >= 0 ? "+" : ""}
                        {calculateModifier(character.dexterity)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Constitution</div>
                      <div className="stat-value">{character.constitution}</div>
                      <div className="stat-desc">
                        Modifier:{" "}
                        {calculateModifier(character.constitution) >= 0
                          ? "+"
                          : ""}
                        {calculateModifier(character.constitution)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Intelligence</div>
                      <div className="stat-value">{character.intelligence}</div>
                      <div className="stat-desc">
                        Modifier:{" "}
                        {calculateModifier(character.intelligence) >= 0
                          ? "+"
                          : ""}
                        {calculateModifier(character.intelligence)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Wisdom</div>
                      <div className="stat-value">{character.wisdom}</div>
                      <div className="stat-desc">
                        Modifier:{" "}
                        {calculateModifier(character.wisdom) >= 0 ? "+" : ""}
                        {calculateModifier(character.wisdom)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Charisma</div>
                      <div className="stat-value">{character.charisma}</div>
                      <div className="stat-desc">
                        Modifier:{" "}
                        {calculateModifier(character.charisma) >= 0 ? "+" : ""}
                        {calculateModifier(character.charisma)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-2">Proficiencies</h2>
                  {character.skill_proficiencies &&
                  character.skill_proficiencies.length > 0 ? (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Skill Proficiencies</h3>
                      <div className="flex flex-wrap gap-2">
                        {character.skill_proficiencies.map((skill, index) => (
                          <span key={index} className="badge badge-primary">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>No skill proficiencies selected.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Background Tab */}
            {activeTab === "background" && (
              <div>
                <h2 className="text-xl font-bold mb-2">Background Story</h2>
                <div className="bg-base-200 p-4 rounded-lg">
                  {character.background_story ? (
                    <div className="prose max-w-none">
                      {character.background_story
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  ) : (
                    <p>No background story available.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Personality</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>{character.personality || "Not specified"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Ideals</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>{character.ideal || "Not specified"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Bonds</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>{character.bond || "Not specified"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Flaws</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>{character.flaw || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailPage;
