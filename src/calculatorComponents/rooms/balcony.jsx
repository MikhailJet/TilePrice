import React from "react";
import Toggle from "../ui/Toggle.jsx";
import Counter from "../ui/Counter.jsx";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Component for balcony fields.
 *
 * @param {Object} material - The material object.
 * @param {Object} room - The room object.
 * @param {Function} updateMaterial - Function to update the material.
 *
 * @returns {JSX.Element} The JSX element to render.
 */
/*******  f1149351-b9e1-4bc3-9970-fe0b0836d1df  *******/
const Balcony = ({ material, room, updateMaterial, errors }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Уклон</label>
        <select
          value={material.slopeType ?? ""}
          onChange={(e) =>
            updateMaterial(room.id, material.id, "slopeType", e.target.value)
          }
          className="input-base"
        >
          <option value="" disabled hidden>
            Выберите тип уклона
          </option>
          <option value="toTrap">К трапу</option>
          <option value="unified">Единый (от квартиры)</option>
        </select>
      </div>
      {errors[material.id]?.slopeType && (
        <p className="text-red-500 text-xs mt-1">Выберите тип уклона</p>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <Toggle
              label="Плинтус на балконе"
              checked={material.baseboardEnabled || false}
              onChange={(enabled) =>
                updateMaterial(
                  room.id,
                  material.id,
                  "baseboardEnabled",
                  enabled,
                )
              }
            />
          </div>
        </div>

        {material.baseboardEnabled && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Метраж, м.п.
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={material.baseboardLength || ""}
                onChange={(e) => {
                  let value = parseFloat(e.target.value) || 0;
                  if (value < 0) value = 0;
                  const rounded = Math.round(value * 100) / 100;
                  updateMaterial(
                    room.id,
                    material.id,
                    "baseboardLength",
                    rounded || 0,
                  );
                }}
                className="input-base"
              />
            </div>
            {errors[material.id]?.baseboardLength && (
              <p className="text-red-500 text-xs mt-1">
                Укажите длину плинтуса
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Внешние углы плинтуса (шт.)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={material.externalBaseboardCornersCount || 0}
                onChange={(e) =>
                  updateMaterial(
                    room.id,
                    material.id,
                    "externalBaseboardCornersCount",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="input-base"
              />
            </div>
            {errors[material.id]?.externalBaseboardCornersCount && (
              <p className="text-red-500 text-xs mt-1">
                Укажите количество внешних углов плинтуса
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Balcony;
