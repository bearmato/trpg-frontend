import React from "react";
import DiceRoller from "../components/DiceRoller";

const DicePage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* 背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
        style={{ backgroundImage: `url('/images/HeroSectionBG03.jpg')` }}
      ></div>

      {/* 内容区域 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg mx-4">
          <DiceRoller />
        </div>
      </div>
    </div>
  );
};

export default DicePage;
