import { Link } from "react-router-dom";

const HomePageMenu = () => {
  return (
    <ul className="menu menu-horizontal bg-[A31D1D] text-[#F8F2DE]">
      <li>
        <Link to="/rules">Rules</Link>
      </li>
      <li>
        <Link to="/ai-gm">AI GM</Link>
      </li>
      <li>
        <Link to="/character-library">Character Library</Link>
      </li>
      <li>
        <Link to="/character-creation">Create Character</Link>
      </li>
      <li>
        <Link to="/map-generator">Map Generator</Link>
      </li>
      <li>
        <Link to="/dice">Dice</Link>
      </li>
    </ul>
  );
};

export default HomePageMenu;
