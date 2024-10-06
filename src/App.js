// App.js
import React from "react";
import Orrery from "./components/Orrery";
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>CosmoTrack: Interactive Orrery</h1>

      <p>Explore the solar system and near-Earth objects in this interactive orrery!</p>
      <Orrery />
    </div>
  );
}

export default App;
