import React, { useState, createContext, useContext } from "react";
import DraggableDiceButton from "./DraggableDiceButton";
import DiceDrawer from "./DiceDrawer";

// 创建上下文以便在组件间共享骰子浮窗状态
interface DiceWidgetContextType {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  isDiceWidgetVisible: boolean;
  toggleDiceWidget: () => void;
}

const DiceWidgetContext = createContext<DiceWidgetContextType | undefined>(
  undefined
);

// 自定义钩子，便于访问上下文
export const useDiceWidget = () => {
  const context = useContext(DiceWidgetContext);
  if (context === undefined) {
    throw new Error("useDiceWidget must be used within a DiceWidgetProvider");
  }
  return context;
};

interface DiceWidgetProviderProps {
  children: React.ReactNode;
}

const DiceWidgetProvider: React.FC<DiceWidgetProviderProps> = ({
  children,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDiceWidgetVisible, setIsDiceWidgetVisible] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleDiceWidget = () => {
    setIsDiceWidgetVisible(!isDiceWidgetVisible);
  };

  const value = {
    isDrawerOpen,
    toggleDrawer,
    isDiceWidgetVisible,
    toggleDiceWidget,
  };

  return (
    <DiceWidgetContext.Provider value={value}>
      {children}
      {isDiceWidgetVisible && (
        <>
          <DraggableDiceButton toggleDrawer={toggleDrawer} />
          <DiceDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </>
      )}
    </DiceWidgetContext.Provider>
  );
};

export default DiceWidgetProvider;
