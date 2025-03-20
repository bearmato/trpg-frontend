// components/StepIndicator.tsx

import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  setCurrentStep,
}) => {
  const steps = ["基本信息", "种族", "职业", "背景", "属性", "技能", "完成"];

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
