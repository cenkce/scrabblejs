import React from 'react';
import './App.css';
import { SceneProvider } from './core/scene/SceneProvider';
import { Game } from './modules/game/Game';

function App() {
  return (
    <div className="App">
      <SceneProvider height={600} width={1000}>
          <Game />
      </SceneProvider>
    </div>
  );
}

export default App;
