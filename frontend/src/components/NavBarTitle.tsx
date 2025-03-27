//import React from 'react'
import { Link } from "react-router-dom";

const NavBarTitle = () => {
  return (
    <Link
      to="/"
      className="btn btn-ghost text-[#F8F2DE] font-bold text-base md:text-xl whitespace-nowrap overflow-hidden text-ellipsis"
    >
      TRPG ASSISTANT
    </Link>
  );
};

export default NavBarTitle;
