"use client"

import { useEffect, useState } from "react";

function useAssistantPanelToggle() {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'L') {
        setIsToggled(prev => !prev);
        console.log(isToggled);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return isToggled;
}

export default useAssistantPanelToggle;
