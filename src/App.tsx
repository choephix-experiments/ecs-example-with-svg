import { useEffect } from 'react';
import GameSandbox from './GameSandbox';
import { populateSampleWorld } from './misc/sampleWorld';
import { actions } from './stores/worldStore';

import './App.css'
;
function App() {
  useEffect(() => {
    populateSampleWorld();

    return () => actions.clearWorld();
  });

  return <GameSandbox />;
}

export default App;
