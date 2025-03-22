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
  // 功能卡片数据 - 只保留四个主要功能
  const features = [
    {
      title: "Rules",
      description: "快速访问和下载D&D 5e的规则书和参考资料,掌握游戏核心机制",
      iconSrc: "/images/logo/rulelogo.png", // 更新为public目录路径
      link: "/rules",
    },
    {
      title: "AI GM",
      description: "让AI作为你的游戏大师,创建和管理你的桌面角色扮演游戏",
      iconSrc: "/images/logo/aigmLogo.png", // 更新为public目录路径
      link: "/ai-gm",
    },
    {
      title: "Map Generator",
      description: "随机生成精美的战役地图和场景,为你的冒险增添视觉体验",
      iconSrc: "/images/logo/mapmakerLogo.png", // 更新为public目录路径
      link: "/map-generator",
    },
    {
      title: "Character Creation",
      description: "轻松创建和管理你的TRPG角色,自定义能力值和特性",
      iconSrc: "/images/logo/characterLogo.png", // 更新为public目录路径
      link: "/character-creation",
    },
  ];

  return (
    <div>
      {/* 主Hero部分，增加了容器和圆角边框 */}
      <div className="container-fluid max-w-[95%] mx-auto mt-4">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div
            className="hero h-[65vh] bg-cover bg-center "
            style={{ backgroundImage: `url('/images/HeroSectionBG07.jpg')` }} // 更新为public目录路径
          >
            <div className="hero-overlay bg-opacity-50  "></div>
            <div className="hero-content text-center text-neutral-content z-10">
              {/* 使用TRPG主题的渐变文字动画效果 */}
              <div className="relative max-w-lg">
                {/* 主标题 */}
                <h1 className="text-6xl font-bold mb-3">
                  <span className="rpg-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    TRPG ASSISTANT
                  </span>
                </h1>

                {/* 更明显的渐变分隔线 */}
                <div className="h-1.5 w-48 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 mx-auto my-4 rounded-full shadow-lg"></div>

                {/* 增强副标题可读性 */}
                <p className="text-white text-xl font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Your complete toolkit for tabletop adventures
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能卡片区域  */}
      <div className="bg-base-100 pt-8 pb-16">
        <div className="container-fluid max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                to={feature.link}
                key={index}
                className="overflow-hidden flex flex-col bg-[#f0e2cb] rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* 圆形PNG图标区域 - 大尺寸图标 */}
                <div className="w-full flex justify-center pt-8 pb-6">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#A31D1D] to-[#d24545] flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 p-3 border-4 border-white">
                    <img
                      src={feature.iconSrc}
                      alt={`${feature.title} 图标`}
                      className="w-24 h-24 object-contain filter brightness-0 invert"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/120x120/ffffff/A31D1D?text=${feature.title[0]}`;
                      }}
                    />
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="p-6 bg-base-200 flex-grow">
                  <h3 className="text-2xl font-bold text-[#A31D1D] mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-center leading-relaxed">
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
