import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const RandomNumberGenerator = () => {
  const [randomNumber, setRandomNumber] = useState('');
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef();

  const generateNumber = () => {
    const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setRandomNumber(number);
    setShowQR(false);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `QRCode_${randomNumber}.png`;
    link.click();
  };

  // 🧠 Update canvas class after render
  useEffect(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.style.transition = 'filter 0.5s ease';
      canvas.style.filter = showQR ? 'blur(0px)' : 'blur(8px)';
    }
  }, [showQR, randomNumber]);

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <button
        onClick={generateNumber}
        className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Generate 10-Digit Number
      </button>

      {randomNumber && (
        <>
          <p className="text-lg font-bold">Generated Number: {randomNumber}</p>

          <div ref={qrRef}>
            <QRCodeCanvas value={randomNumber+"a"} size={200} />
          </div>

          {!showQR && (
            <button
              onClick={() => setShowQR(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
            >
              Show QR Code
            </button>
          )}

          {showQR && (
            <button
              onClick={downloadQRCode}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Download QR Code
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RandomNumberGenerator;
