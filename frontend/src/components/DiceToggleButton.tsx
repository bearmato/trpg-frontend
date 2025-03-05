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
      title={isDiceWidgetVisible ? "隐藏骰子" : "显示骰子"}
    >
      <img
        src={diceIcon}
        alt="骰子"
        width="20"
        height="20"
        className="w-5 h-5 filter brightness-0 invert"
        // 使用固定的白色滤镜，在深色导航栏上显示清晰
      />
    </button>
  );
};

export default DiceToggleButton;
