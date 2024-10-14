import { useEffect } from "react";
import GameSandbox from "./GameSandbox";
import { populateSampleWorld } from "./misc/sampleWorld";
import { worldDataStateActions } from "./stores/worldDataState";
import { ideStateActions } from "./stores/ideStore";

import "./globalActions";
import "./App.css";

function App() {
  useEffect(() => {
    populateSampleWorld();

    return () => {
      worldDataStateActions.clearWorld();
      ideStateActions.setSelectedEntityId(null);
    };
  }, []); // Added empty dependency array to run effect only once

  return <GameSandbox />;
}

export default App;
