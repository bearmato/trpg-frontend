// steps/BasicInfoStep.tsx

import React from "react";
import { Character } from "../types/character";

interface BasicInfoStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Basic Information</h2>
        <div className="form-control w-full max-w-md mx-auto">
          <label className="label">
            <span className="label-text text-lg">Character Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your character's name"
            className="input input-bordered w-full"
            value={character.name}
            onChange={(e) => updateCharacter("name", e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Choose a name that fits the game world's setting. This will be your
            identity throughout your adventures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
