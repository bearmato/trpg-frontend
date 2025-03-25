import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserCharacters, deleteCharacter } from "../api/characters";
import { useAuth } from "../contexts/AuthContext";

interface CharacterCard {
  id: string;
  name: string;
  race: string;
  character_class: string;
  level: number;
  portrait_url: string;
  created_at: string;
}

const CharacterLibraryPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 加载用户角色数据
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/character-library" } });
      return;
    }

    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserCharacters();
        setCharacters(data);
      } catch (err) {
        console.error("Failed to fetch characters:", err);
        setError("Failed to load your characters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [isAuthenticated, navigate]);

  // 删除角色处理
  const handleDeleteCharacter = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      try {
        await deleteCharacter(id);
        setCharacters((prev) => prev.filter((char) => char.id !== id));
      } catch (err) {
        console.error("Failed to delete character:", err);
        setError("Failed to delete character");
      }
    }
  };

  // 格式化日期函数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4 pb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Character Library</h1>
        <Link to="/character-creation" className="btn btn-primary">
          Create New Character
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error ? (
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
          <span>{error}</span>
        </div>
      ) : characters.length === 0 ? (
        <div className="bg-base-200 p-8 rounded-lg text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-4">No Characters Found</h2>
          <p className="mb-6">
            You haven't created any characters yet. Start by creating your first
            character!
          </p>
          <Link to="/character-creation" className="btn btn-primary">
            Create First Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="card bg-base-100 shadow-xl overflow-hidden h-[440px]"
            >
              <figure className="h-64 relative">
                {character.portrait_url ? (
                  <img
                    src={character.portrait_url}
                    alt={`${character.name}'s portrait`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 flex items-center justify-center">
                    <span className="text-6xl opacity-30">🧙</span>
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2">
                  <div className="badge badge-primary">
                    Lvl {character.level}
                  </div>
                </div>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title">{character.name}</h2>
                <p>
                  {character.race} {character.character_class}
                </p>
                <p className="text-xs text-base-content/70">
                  Created: {formatDate(character.created_at)}
                </p>
                <div className="card-actions justify-between mt-4">
                  <Link
                    to={`/character-library/${character.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteCharacter(character.id)}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterLibraryPage;
