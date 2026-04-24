import React from "react";
import Toggle from "./ui/Toggle.jsx";
import Counter from "./ui/Counter.jsx";

const ExtraItems = ({ material, room, updateMaterial, errors }) => {
  const isIsland = material.surface === "island";
  const isBacksplash = material.surface === "backsplash";
  const isCountertop = material.surface === "countertop";
  const isWindowsill = material.surface === "windowsill";

  return (
    <>
      {isBacksplash && (
        <>
          {/*  ДЛИНА ФАРТУКА */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Общая длина фартука (м.п.)
            </label>
            {console.log("Текущая поверхность:", material.surface)}
            <input
              type="number"
              value={
                material.backsplashLength === 0 ? "" : material.backsplashLength
              }
              onChange={(e) => {
                let value = parseFloat(e.target.value) || 0;
                if (value < 0) value = 0;
                const rounded = Math.round(value * 100) / 100;
                updateMaterial(
                  room.id,
                  material.id,
                  "backsplashLength",
                  rounded,
                );
              }}
              step="0.01"
              min="0"
              className="input-base"
              placeholder="0"
            />
            {errors[material.id]?.backsplashLength && (
              <p className="text-red-500 text-xs mt-1">Укажите длину фартука</p>
            )}
          </div>
          {/*  КОЛИЧЕСТВО ОТВЕРСТИЙ */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Количество отверстий, (шт.)
            </label>
            <input
              type="number"
              value={material.hole === 0 ? "" : material.hole}
              onChange={(e) => {
                let value = parseFloat(e.target.value) || 0;
                if (value < 0) value = 0;
                const rounded = Math.round(value * 100) / 100;
                updateMaterial(room.id, material.id, "hole", rounded);
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
          {/*  ТОГГЛЕР: Монтаж фартука после установки кухни */}
          <div className="mb-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
              <Toggle
                label="Требуется монтаж фартука после установки кухни"
                checked={material.isInstallAfterKitchen || false}
                onChange={(enabled) =>
                  updateMaterial(
                    room.id,
                    material.id,
                    "isInstallAfterKitchen",
                    enabled,
                  )
                }
              />
              <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                (По умолчанию или выключено - монтаж до установки)
              </p>
            </div>
          </div>
        </>
      )}
      {isIsland && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Остров добавлен
          </label>
          <p className="text-gray-600 text-sm">
            Дополнительную информацию по стоимости острова можно получить позже,
            при составлении сметы.
          </p>
        </div>
      )}
      {/* СТОЛЕШНИЦА*/}
      {isCountertop && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Общая длина столешницы (м.п.)
          </label>
          <input
            type="number"
            value={
              material.countertopLength === 0 ? "" : material.countertopLength
            }
            onChange={(e) => {
              let value = parseFloat(e.target.value) || 0;
              if (value < 0) value = 0;
              const rounded = Math.round(value * 100) / 100;
              updateMaterial(room.id, material.id, "countertopLength", rounded);
            }}
            step="0.01"
            min="0"
            className="input-base"
            placeholder="0"
          />
          {errors[material.id]?.countertopLength && (
            <p className="text-red-500 text-xs mt-1">
              Укажите длину столешницы
            </p>
          )}
        </div>
      )}
      {/* ПОДОКОННИК*/}
      {isWindowsill && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Общая длина подоконника (м.п.)
          </label>
          <input
            type="number"
            value={
              material.windowsillLength === 0 ? "" : material.windowsillLength
            }
            onChange={(e) => {
              let value = parseFloat(e.target.value) || 0;
              if (value < 0) value = 0;
              const rounded = Math.round(value * 100) / 100;
              updateMaterial(room.id, material.id, "windowsillLength", rounded);
            }}
            step="0.01"
            min="0"
            className="input-base"
            placeholder="0"
          />
          {errors[material.id]?.windowsillLength && (
            <p className="text-red-500 text-xs mt-1">
              Укажите длину подоконника
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ExtraItems;
