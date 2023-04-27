import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Screen } from "../types/helpTypes";

const useHelp = () => {
  const [showScreen, setShowScreen] = useState(Screen.WELCOME);

  const location = useLocation();

  useEffect(() => {
    // when user clicks on retry tour, param (tour=true) is added to the url,so that directly second page is Second Screen
    // Opened
    if (location.search.includes("tour=true")) {
      setShowScreen(Screen.SECOND);
    }
  }, []);

  const handleChangeScreen = () => {
    setShowScreen(Screen.SECOND);
  };

  return {
    showScreen,
    handleChangeScreen
  };
};

export default useHelp;
