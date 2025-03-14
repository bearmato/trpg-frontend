import React from "react";
import { Link } from "react-router-dom";
import "../styles/gradient-text-animation.css"; // 导入渐变文字动画样式

const Hero: React.FC = () => {
  // 功能卡片数据 - 使用中文描述以与参考图一致
  const features = [
    {
      title: "Rules",
      description: "快速访问和下载D&D 5e的规则书和参考资料,掌握游戏核心机制",
      image: "./images/rules-feature.jpg",
      link: "/rules",
    },
    {
      title: "AI GM",
      description: "让AI作为你的游戏大师,创建和管理你的桌面角色扮演游戏",
      image: "./images/aigm-feature.jpg",
      link: "/ai-gm",
    },
    {
      title: "Map Generator",
      description: "随机生成精美的战役地图和场景,为你的冒险增添视觉体验",
      image: "./images/map-feature.jpg",
      link: "/map-generator",
    },
    {
      title: "Background",
      description: "创建丰富多彩的角色背景故事,增加你角色的深度和个性",
      image: "./images/background-feature.jpg",
      link: "/background",
    },
    {
      title: "Character Creation",
      description: "轻松创建和管理你的TRPG角色,自定义能力值和特性",
      image: "./images/character-feature.jpg",
      link: "/character-creation",
    },
    {
      title: "Dice",
      description: "虚拟骰子工具,支持各种TRPG常用骰子和复杂的掷骰表达式",
      image: "./images/dice-feature.jpg",
      link: "/dice",
    },
  ];

  return (
    <div>
      {/* 主Hero部分，增加了容器和圆角边框 */}
      <div className="container-fluid max-w-[95%] mx-auto mt-4 ">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div
            className="hero h-[75vh] bg-cover bg-center "
            style={{ backgroundImage: `url('./images/HeroSectionBG07.jpg')` }}
          >
            <div className="hero-overlay bg-opacity-50"></div>
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

      {/* 功能卡片区域 - 使用与参考图一致的设计 */}
      <div className="bg-base-100 pt-8 pb-16">
        <div className="container-fluid max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                to={feature.link}
                key={index}
                className="overflow-hidden flex flex-col bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* 图片区域 */}
                <div className="w-full rounded-t-lg overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/600x400/e2e8f0/a3171e?text=${feature.title}`;
                    }}
                  />
                </div>

                {/* 内容区域 */}
                <div className="p-6 bg-base-200 flex-grow">
                  <h3 className="text-2xl font-bold text-[#A31D1D] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
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
