import { useState, useRef, useEffect } from "react";
import diceIcon from "../assets/dice-icon.svg"; // 使用自定义的骰子图标组件

interface DraggableDiceButtonProps {
  toggleDrawer: () => void;
}

const DraggableDiceButton = ({ toggleDrawer }: DraggableDiceButtonProps) => {
  const [position, setPosition] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 100,
  }); // 初始位置
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // 计算新位置，确保按钮不会超出视口边界
      const newX = Math.min(
        Math.max(0, e.clientX - dragOffset.x),
        window.innerWidth - (buttonRef.current?.offsetWidth || 0)
      );
      const newY = Math.min(
        Math.max(0, e.clientY - dragOffset.y),
        window.innerHeight - (buttonRef.current?.offsetHeight || 0)
      );

      setPosition({ x: newX, y: newY });
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 设置和清理全局鼠标事件监听器
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={buttonRef}
      className="fixed shadow-xl cursor-move rounded-full z-50 flex items-center justify-center bg-[#A31D1D] hover:bg-pink-600 transition-colors"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "60px",
        height: "60px",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        // 只有当不是在拖动结束时才触发点击事件
        if (!isDragging) {
          toggleDrawer();
        }
        e.stopPropagation();
      }}
    >
      <img
        src={diceIcon}
        alt="Dice"
        className="w-10 h-10 animate-pulse"
        style={{ filter: "brightness(0) invert(1)" }} // 使SVG变为白色
      />
    </div>
  );
};

export default DraggableDiceButton;
