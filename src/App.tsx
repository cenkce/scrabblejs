import React from 'react';
import './App.scss';
import { SceneProvider } from './core/scene/SceneProvider';
import { Game } from './modules/game';
import { NetworkProvider } from './modules/network/Network';
import { NetworkPanel } from './modules/network/NetworkPanel';

function App() {
  return (
    <div className="App">
      <NetworkProvider>
        <NetworkPanel></NetworkPanel>
        <SceneProvider height={600} width={1000}>
          <Game />
        </SceneProvider>
      </NetworkProvider>
    </div>
  );
}

export default App;
