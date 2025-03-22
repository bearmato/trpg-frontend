// components/StepIndicator.tsx

import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number; // 修改为必需参数，确保它被使用
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  setCurrentStep,
  totalSteps = 8, // 默认值保持不变
}) => {
  // 基本步骤标签
  const steps = [
    "基本信息",
    "种族",
    "职业",
    "背景",
    "属性",
    "技能",
    "立绘",
    "完成",
  ].slice(0, totalSteps); // 使用传入的totalSteps来截取需要的步骤

  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`step ${
            currentStep > index ? "step-primary" : ""
          } cursor-pointer`}
          onClick={() => {
            // 只允许回到之前的步骤
            if (currentStep > index + 1) {
              setCurrentStep(index + 1);
            }
          }}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};

export default StepIndicator;
