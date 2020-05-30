import React from 'react';
import './App.scss';
import { SceneProvider } from './core/scene/SceneProvider';
import { NetworkStateProvider } from './modules/network/Network';
import { NetworkPanel } from './modules/network/NetworkPanel';
import { GameModule } from './modules/game';
import "./modules/peers"

function App() {
  return (
    <div className="App">
      <NetworkStateProvider>
        <NetworkPanel></NetworkPanel>
        <SceneProvider height={600} width={1000}>
          <GameModule />
        </SceneProvider>
      </NetworkStateProvider>
    </div>
  );
}

export default App;
