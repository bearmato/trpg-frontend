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
        <Link to="/map-generator">map generater</Link>
      </li>
      <li>
        <Link to="/background">background</Link>
      </li>
      <li>
        <Link to="/character-creation">character-creation</Link>
      </li>
      <li>
        <Link to="/dice">dice</Link>
      </li>
    </ul>
  );
};

export default HomePageMenu;
