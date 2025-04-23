import React from "react";
import DiceRoller from "./DiceRoller";

interface DiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiceDrawer: React.FC<DiceDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* 抽屉组件 - 使用 DaisyUI 5.0 样式 */}
      <div
        className={`fixed top-0 right-0 w-[500px] max-w-[95vw] h-full bg-base-100 shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 抽屉头部 - 使用 DaisyUI 样式 */}
          <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-content">
            <h2 className="text-xl font-bold">🎲 Dice Roller</h2>
            <button
              onClick={onClose}
              className="btn btn-circle btn-ghost btn-sm"
              aria-label="关闭"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 抽屉内容 - 骰子组件 */}
          <div className="flex-1 overflow-y-auto p-4 bg-base-200">
            <DiceRoller />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiceDrawer;
