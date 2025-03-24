import React from "react";
import diceIcon from "../assets/dice-icon2.svg"; // 导入存放在 assets 中的 SVG 文件

interface DiceToggleButtonProps {
  toggleDiceWidget: () => void;
  isDiceWidgetVisible: boolean;
}

const DiceToggleButton: React.FC<DiceToggleButtonProps> = ({
  toggleDiceWidget,
  isDiceWidgetVisible,
}) => {
  return (
    <button
      onClick={toggleDiceWidget}
      className="btn btn-ghost btn-circle text-[#F8F2DE]"
      title={isDiceWidgetVisible ? "Hide Dice" : "Show Dice"}
    >
      <img
        src={diceIcon}
        alt="Dice"
        width="20"
        height="20"
        className="w-5 h-5 filter brightness-0 invert"
      />
    </button>
  );
};

export default DiceToggleButton;
