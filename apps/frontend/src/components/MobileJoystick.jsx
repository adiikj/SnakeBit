import React from 'react';
import right from '../assets/Graphics/right.png';
import left from '../assets/Graphics/left.png';
import up from '../assets/Graphics/up.png';
import down from '../assets/Graphics/down.png';


function MobileJoystick() {
  // Function to handle button click and simulate the key press
  const handleButtonClick = (dir) => {
    // Create a new keyboard event to simulate the key press
    const event = new KeyboardEvent('keydown', {
      key: `Arrow${dir}`, // 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
      code: `Arrow${dir}`,
      keyCode: dir === 'Up' ? 38 : dir === 'Down' ? 40 : dir === 'Left' ? 37 : 39,
      bubbles: true,
    });
    
    // Dispatch the event on the window
    window.dispatchEvent(event);
    console.log(`${dir} button clicked!`); // For debugging or further implementation
  };

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        {/* Empty center cell */}
        <div></div>

        {/* Up Button (grid cell 2) */}
        <button
          onClick={() => handleButtonClick('Up')}
          className="pb-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-1 col-start-2"
        >
          <img className="w-7 h-7" src={up} alt="" />
        </button>

        {/* Right Button (grid cell 6) */}
        <button
          onClick={() => handleButtonClick('Right')}
          className="pl-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-2 col-start-3"
        >
          <img className="w-7 h-7" src={right} alt="" />
        </button>

        {/* Left Button (grid cell 4) */}
        <button
          onClick={() => handleButtonClick('Left')}
          className="pr-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-2 col-start-1"
        >
          <img className="w-7 h-7" src={left} alt="" />
        </button>

        {/* Empty cell for alignment */}
        <div></div>

        {/* Down Button (grid cell 8) */}
        <button
          onClick={() => handleButtonClick('Down')}
          className="pt-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-3 col-start-2"
        >
          <img className="w-7 h-7" src={down} alt="" />
        </button>
      </div>
    </div>
  );
}

export default MobileJoystick;
