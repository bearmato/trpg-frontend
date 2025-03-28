import { Link } from "react-router-dom";

const HomePageMenu = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <Link to="/rules" className="btn btn-ghost text-[#F8F2DE] lg:inline-flex">
        Rules
      </Link>
      <Link to="/ai-gm" className="btn btn-ghost text-[#F8F2DE] lg:inline-flex">
        AI GM
      </Link>
      <Link
        to="/character-library"
        className="btn btn-ghost text-[#F8F2DE] lg:inline-flex"
      >
        Character Library
      </Link>
      <Link
        to="/character-creation"
        className="btn btn-ghost text-[#F8F2DE] lg:inline-flex"
      >
        Create Character
      </Link>
      <Link
        to="/map-generator"
        className="btn btn-ghost text-[#F8F2DE] lg:inline-flex"
      >
        Map Generator
      </Link>
      <Link to="/dice" className="btn btn-ghost text-[#F8F2DE] lg:inline-flex">
        Dice
      </Link>
    </div>
  );
};

export default HomePageMenu;
