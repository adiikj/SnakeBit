import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Choice from './components/Choice';
import Config from './components/singleplayer/Config';
import Play from './components/singleplayer/Play.jsx';
import Room from './components/multiplayer/Room.jsx';
import MultiHome from './components/multiplayer/MultiHome.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/singleplayer/config" element={<Config/>} />
        <Route path="/signleplayer/play" element={<Play/>} />
        <Route path="/multiplayer/joinroom" element={<Room/>}/>
        <Route path="/multiplayer/home" element={<MultiHome/>}/>
      </Routes>
    </Router>
  );
}

export default App;
