import React from 'react';

const Counter = ({ value, onChange, onZero, max = 20 }) => {
  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    } else {
      // Если нажали минус при значении 1
      onZero(); 
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-200">
      <button
        type="button"
        onClick={handleDecrement}
        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 active:scale-90 transition shadow-sm text-gray-700"
      >
        <span className="text-xl leading-none">−</span>
      </button>

      <span className="text-sm font-bold w-6 text-center select-none text-gray-800">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 active:scale-90 transition shadow-sm text-gray-700"
      >
        <span className="text-xl leading-none">+</span>
      </button>
    </div>
  );
};

export default Counter;