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
    "Basic Info",
    "Race",
    "Class",
    "Background",
    "Abilities",
    "Skills",
    "Portrait",
    "Complete",
  ].slice(0, totalSteps); // Use the provided totalSteps to slice the steps array

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
