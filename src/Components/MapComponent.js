import React, { useState } from 'react';

const RandomNumberGenerator = () => {
  const [randomNumber, setRandomNumber] = useState('');

  const generateNumber = () => {
    const number = Math.floor(1000000000 + Math.random() * 9000000000);
    setRandomNumber(number);
  };

  return (
    <div className="p-4">
      <button onClick={generateNumber} className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate 10-Digit Number
      </button>
      {randomNumber && (
        <p className="mt-4 text-lg font-semibold">Generated Number: {randomNumber}</p>
      )}
    </div>
  );
};

export default RandomNumberGenerator;
