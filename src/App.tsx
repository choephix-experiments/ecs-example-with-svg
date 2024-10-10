import { useEffect } from 'react';
import GameSandbox from './GameSandbox';
import { populateSampleWorld } from './misc/sampleWorld';
import { worldStateActions } from './stores/worldStore';

import './App.css'
;
function App() {
  useEffect(() => {
    populateSampleWorld();

    return () => worldStateActions.clearWorld();
  });

  return <GameSandbox />;
}

export default App;
