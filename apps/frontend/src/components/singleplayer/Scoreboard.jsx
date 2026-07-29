import React from 'react';

function Scoreboard({ score, highscore }) {
  return (
    <div className="flex md:flex-row gap-6 md:gap-44 tracking-wider py-2 rounded-lg bg-green-600 text-white">
      <div className="text-xl md:text-3xl px-3 md:px-10">Score: {score}</div>
      <div className="text-xl md:text-3xl px-3  md:px-10">High Score: {highscore}</div>
    </div>
  );
}

export default Scoreboard;
