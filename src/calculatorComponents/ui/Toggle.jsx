import React from "react";

const Toggle = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label
      className={`flex items-center cursor-pointer select-none group ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="relative">
        {/* Скрытый чекбокс */}
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />

        {/* Линия (фон) */}
        <div
          className={`block w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${
            checked ? "bg-gray-800" : "bg-gray-300"
          }`}
        ></div>

        {/* Кругляшок (ползунок) */}
        <div
          className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-md ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>

      {/* Текст метки */}
      {label && (
        <span className="ml-3 text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;
