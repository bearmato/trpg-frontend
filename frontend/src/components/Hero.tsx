import React from "react";
import { Link } from "react-router-dom";
import "../styles/gradient-text-animation.css"; // 导入渐变文字动画样式

// 移除导入图标的语句
// 不再使用这些导入
// import aigmLogo from "../assets/logo/aigmlogo.png";
// import characterLogo from "../assets/logo/characterLogo.png";
// import mapmakerLogo from "../assets/logo/mapmakerLogo.png";
// import ruleLogo from "../assets/logo/rulelogo.png";

const Hero: React.FC = () => {
  // Feature card data
  const features = [
    {
      title: "Rules",
      description:
        "Quick access and download D&D 5e rulebooks and reference materials, master the core game mechanics",
      iconSrc: "/images/logo/rulelogo.png",
      link: "/rules",
    },
    {
      title: "AI GM",
      description:
        "Let AI be your Game Master, create and manage your tabletop roleplaying games",
      iconSrc: "/images/logo/aigmLogo.png",
      link: "/ai-gm",
    },
    {
      title: "Map Generator",
      description:
        "Randomly generate beautiful campaign maps and scenes, add visual experience to your adventures",
      iconSrc: "/images/logo/mapmakerLogo.png",
      link: "/map-generator",
    },
    {
      title: "Character Creation",
      description:
        "Easily create and manage your TRPG characters, customize abilities and traits",
      iconSrc: "/images/logo/characterLogo.png",
      link: "/character-creation",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero部分 */}
      <div className="w-[90%] max-w-[1920px] mx-auto mt-4">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div
            className="hero min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-cover bg-center relative"
            style={{ backgroundImage: `url('/images/HeroSectionBG08.jpg')` }}
          >
            <div className="hero-overlay bg-opacity-50"></div>
            <div className="hero-content text-center text-neutral-content z-10">
              <div className="max-w-3xl px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                  <span className="rpg-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    TRPG ASSISTANT
                  </span>
                </h1>
                <div className="h-1 sm:h-1.5 w-24 sm:w-32 md:w-40 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 mx-auto my-3 sm:my-4 rounded-full shadow-lg"></div>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Your complete toolkit for tabletop adventures
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能卡片区域 */}
      <div className="bg-base-100 py-6 sm:py-8 lg:py-12">
        <div className="w-[90%] max-w-[1920px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Link
                to={feature.link}
                key={index}
                className="group bg-[#f0e2cb] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
              >
                {/* 图标区域 */}
                <div className="w-full pt-4 sm:pt-6 pb-3 sm:pb-4 flex justify-center">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-[#A31D1D] to-[#d24545] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 p-2 sm:p-3 border-4 border-white">
                    <img
                      src={feature.iconSrc}
                      alt={`${feature.title} Icon`}
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain filter brightness-0 invert"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/120x120/ffffff/A31D1D?text=${feature.title[0]}`;
                      }}
                    />
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="p-3 sm:p-4 lg:p-6 bg-base-200 flex-grow flex flex-col justify-between">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#A31D1D] mb-2 sm:mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-center text-xs sm:text-sm lg:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
