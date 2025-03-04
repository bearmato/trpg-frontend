import React, { useState } from "react";
import DraggableDiceButton from "./DraggableDiceButton";
import DiceDrawer from "./DiceDrawer";

interface DiceWidgetProviderProps {
  children: React.ReactNode;
}

const DiceWidgetProvider: React.FC<DiceWidgetProviderProps> = ({
  children,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {children}
      <DraggableDiceButton toggleDrawer={toggleDrawer} />
      <DiceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default DiceWidgetProvider;
