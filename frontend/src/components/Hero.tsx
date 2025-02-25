/**
 * @todo 添加route
 */

import bgImage from "../assets/HeroSectionBG.jpg";

const Hero = () => {
  return (
    <div
      className="hero min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }} // 背景图片路径
    >
      <div className="hero-overlay bg-opacity-50"></div> {/*半透明遮罩 */}
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white">
            Everything For Your Adventures
          </h1>
          <p className="py-6 text-lg">
            Create and Play Free Unlimited Characters
          </p>
          <button className="btn btn-primary bg-pink-500 border-none text-white px-6 py-3 rounded-lg">
            Create a Character Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
