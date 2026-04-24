import React from "react";
import Toggle from "../ui/Toggle.jsx";
import Counter from "../ui/Counter.jsx";

const RoomKitchen = ({ material, room, updateMaterial, errors }) => {
  return (
    <>
      {/* 1. СЕЛЕКТОР ЗАТИРКИ */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Тип затирки:
        </label>
        <select
          value={material.groutType || "cement"}
          onChange={(e) =>
            updateMaterial(room.id, material.id, "groutType", e.target.value)
          }
          className="input-base"
        >
          <option value="cement">Цементная</option>
          <option value="epoxy">Эпоксидная</option>
        </select>
        {errors[material.id]?.groutType && (
          <p className="text-red-500 text-xs mt-1">Выберите тип затирки</p>
        )}
      </div>

      {/* 2. ТОГГЛЕР СЛОЖНОЙ УКЛАДКИ */}
      <div className="mb-4">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
          <Toggle
            label="Сложная укладка / Рельефная плитка"
            checked={material.isExtraTileType || false}
            onChange={(enabled) =>
              updateMaterial(room.id, material.id, "isExtraTileType", enabled)
            }
          />
          <p className="text-[10px] text-gray-400 mt-2 leading-tight">
            (елочкой, по диагонали, рельефная или шершавая плитка)
          </p>
        </div>
      </div>

      {/* 3. КОЛИЧЕСТВО ОТВЕРСТИЙ */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Количество отверстий, (шт.)
        </label>
        <input
          type="number"
          value={material.hole === 0 ? "" : material.hole}
          onChange={(e) => {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) value = 0;
            updateMaterial(room.id, material.id, "hole", value);
          }}
          step="1"
          min="0"
          className="input-base"
          placeholder="0"
        />
        {errors[material.id]?.hole && (
          <p className="text-red-500 text-xs mt-1">
            Укажите количество отверстий
          </p>
        )}
      </div>
    </>
  );
};

export default RoomKitchen;
