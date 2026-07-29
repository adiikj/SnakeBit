'use client';

type ArrowDirection = 'Up' | 'Down' | 'Left' | 'Right';

const KEY_CODES: Record<ArrowDirection, number> = {
  Up: 38,
  Down: 40,
  Left: 37,
  Right: 39,
};

export default function MobileJoystick() {
  // Simulate the corresponding arrow key press so the same keydown handler in Gameboard reacts.
  const handleButtonClick = (dir: ArrowDirection) => {
    const event = new KeyboardEvent('keydown', {
      key: `Arrow${dir}`,
      code: `Arrow${dir}`,
      keyCode: KEY_CODES[dir],
      bubbles: true,
    });

    window.dispatchEvent(event);
    console.log(`${dir} button clicked!`);
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
          <img className="w-7 h-7" src="/Graphics/up.png" alt="" />
        </button>

        {/* Right Button (grid cell 6) */}
        <button
          onClick={() => handleButtonClick('Right')}
          className="pl-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-2 col-start-3"
        >
          <img className="w-7 h-7" src="/Graphics/right.png" alt="" />
        </button>

        {/* Left Button (grid cell 4) */}
        <button
          onClick={() => handleButtonClick('Left')}
          className="pr-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-2 col-start-1"
        >
          <img className="w-7 h-7" src="/Graphics/left.png" alt="" />
        </button>

        {/* Empty cell for alignment */}
        <div></div>

        {/* Down Button (grid cell 8) */}
        <button
          onClick={() => handleButtonClick('Down')}
          className="pt-1 w-12 h-12 bg-green-600 rounded-full text-3xl text-white hover:bg-green-500 focus:outline-none flex justify-center items-center row-start-3 col-start-2"
        >
          <img className="w-7 h-7" src="/Graphics/down.png" alt="" />
        </button>
      </div>
    </div>
  );
}
