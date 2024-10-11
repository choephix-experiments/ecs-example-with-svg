import { useEffect } from 'react';
import GameSandbox from './GameSandbox';
import { populateSampleWorld } from './misc/sampleWorld';
import { worldDataStateActions } from './stores/worldDataState';

import './App.css'
;
function App() {
  useEffect(() => {
    populateSampleWorld();

    return () => worldDataStateActions.clearWorld();
  });

  return <GameSandbox />;
}

export default App;
