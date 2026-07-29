'use client';

import { useState, useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';

export default function Room() {
  const [roomCode, setRoomCode] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    // Listen for messages from the server
    socket.on('room-joined', (message: string) => {
      alert(message);
    });

    return () => {
      socket.off('room-joined');
    };
  }, []);

  // Generate a random room code
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setCopySuccess('');
  };

  // Copy the room code to clipboard
  const copyToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopySuccess('Room code copied!');
    }
  };

  // Handle joining the room
  const joinRoom = () => {
    if (!roomCode) {
      alert('Please enter a valid room code!');
      return;
    }
    // Emit the room code to the server
    getSocket().emit('join-room', roomCode);

    // Hand the room code off via sessionStorage (Next.js navigation has no router state) and navigate
    sessionStorage.setItem('roomCode', roomCode);
    router.push('/multiplayer/home');
  };

  return (
    <div className="w-full h-screen bg-green-600 flex items-center justify-center font-arcade">
      <div className="bg-green-500 rounded-lg shadow-lg p-6 h-96 [width:500px]">
        <h1 className="text-5xl text-white tracking-wider mb-4 text-center">Join a Room</h1>

        <div className="mb-4 relative">
          <label htmlFor="roomCode" className="block text-gray-200 text-3xl tracking-wider mb-2">
            Room Code
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              className="w-full px-4 py-2 text-3xl tracking-wider border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button onClick={copyToClipboard} className="ml-2 text-gray-200 hover:text-white transition">
              <FaCopy size={24} />
            </button>
          </div>
        </div>

        <button
          onClick={joinRoom}
          className="w-full text-3xl bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Join
        </button>

        <div className="my-4 flex justify-between items-center">
          <button
            onClick={generateRoomCode}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Generate Code
          </button>
        </div>

        {copySuccess && <p className="text-green-600 text-center mt-2">{copySuccess}</p>}
      </div>
    </div>
  );
}
