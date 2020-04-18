import React from 'react';
import './App.scss';
import { SceneProvider } from './core/scene/SceneProvider';
import { NetworkProvider } from './modules/network/Network';
import { NetworkPanel } from './modules/network/NetworkPanel';
import { GameModule } from './modules/game';

function App() {
  return (
    <div className="App">
      <NetworkProvider>
        <NetworkPanel></NetworkPanel>
        <SceneProvider height={600} width={1000}>
          <GameModule />
        </SceneProvider>
      </NetworkProvider>
    </div>
  );
}

export default App;
