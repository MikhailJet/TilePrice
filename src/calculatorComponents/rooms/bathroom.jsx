import React from "react";
import Toggle from "../ui/Toggle.jsx";
import Counter from "../ui/Counter.jsx";

const Bathroom = ({ material, room, updateMaterial, errors }) => {
  const isFloor = material.surface === "floor";
  const isWalls = material.surface === "walls";
  return (
    <>
      {(isWalls || isFloor) && (
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
      )}

      {isWalls && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Откосы на дверях или окнах, (м.п.)
            </label>
            <input
              type="number"
              value={material.windowReveal === 0 ? "" : material.windowReveal}
              onChange={(e) => {
                let value = parseFloat(e.target.value) || 0;
                if (value < 0) value = 0;
                const rounded = Math.round(value * 100) / 100;
                updateMaterial(room.id, material.id, "windowReveal", rounded);
              }}
              step="0.01"
              className="input-base"
              placeholder="0"
            />
            {errors[material.id]?.windowReveal && (
              <p className="text-red-500 text-xs mt-1">
                Укажите количество откосов
              </p>
            )}
          </div>

          {/* ПОЛКА ИЗ КЕРАМОГРАНИТА */}
          <div className="mb-4">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
              {/* Левая часть: Тогглер и Название */}
              <div className="flex items-center gap-3">
                <Toggle
                  label="Полка из керамогранита, (шт.)"
                  checked={material.shelfEnabled || false}
                  onChange={(enabled) => {
                    updateMaterial(
                      room.id,
                      material.id,
                      "shelfEnabled",
                      enabled,
                    );
                    updateMaterial(
                      room.id,
                      material.id,
                      "shelfCount",
                      enabled ? 1 : 0,
                    );
                  }}
                />
              </div>

              {/* Правая часть: Управление количеством (только если включено) */}
              {material.shelfEnabled && (
                <Counter
                  value={material.shelfCount || 1}
                  onChange={(newCount) =>
                    updateMaterial(room.id, material.id, "shelfCount", newCount)
                  }
                  onZero={() => {
                    // Логика выключения при достижении нуля
                    updateMaterial(room.id, material.id, "shelfEnabled", false);
                    updateMaterial(room.id, material.id, "shelfCount", 0);
                  }}
                />
              )}
            </div>
          </div>
          {/* ВАННАЯ С ЭКРАНОМ */}
          <div className="mb-4">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
              {/* Левая часть: Тогглер и Название */}
              <div className="flex items-center gap-3">
                <Toggle
                  label="Монтаж ванны с экраном, (шт.)"
                  checked={material.bathroomInstall || false}
                  onChange={(enabled) => {
                    updateMaterial(
                      room.id,
                      material.id,
                      "bathroomInstall",
                      enabled,
                    );
                    updateMaterial(
                      room.id,
                      material.id,
                      "bathroomCount",
                      enabled ? 1 : 0,
                    );
                  }}
                />
              </div>

              {/* Правая часть: Управление количеством (только если включено) */}
              {material.bathroomInstall && (
                <Counter
                  value={material.bathroomCount || 1}
                  onChange={(newCount) =>
                    updateMaterial(
                      room.id,
                      material.id,
                      "bathroomCount",
                      newCount,
                    )
                  }
                  onZero={() => {
                    // Логика выключения при достижении нуля
                    updateMaterial(
                      room.id,
                      material.id,
                      "bathroomInstall",
                      false,
                    );
                    updateMaterial(room.id, material.id, "bathroomCount", 0);
                  }}
                />
              )}
            </div>
          </div>
          {/* ВАННАЯ С ЭКРАНОМ - END */}
          {/* ДУШЕВОЙ ПОДДОН — START */}
          <div className="mb-4">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
              {/* Левая часть: Тогглер и Название */}
              <div className="flex items-center gap-3">
                <Toggle
                  label="Душевой поддон, (шт.)"
                  checked={material.showerTray || false}
                  onChange={(enabled) => {
                    updateMaterial(room.id, material.id, "showerTray", enabled);
                    updateMaterial(
                      room.id,
                      material.id,
                      "showerTrayCount",
                      enabled ? 1 : 0,
                    );
                    // Инициализируем тип поддона при включении, если он пустой
                    if (enabled && !material.showerTrayType) {
                      updateMaterial(
                        room.id,
                        material.id,
                        "showerTrayType",
                        "evenFloor",
                      );
                    }
                  }}
                />
              </div>

              {/* Правая часть: Управление количеством */}
              {material.showerTray && (
                <Counter
                  value={material.showerTrayCount || 1}
                  onChange={(newCount) =>
                    updateMaterial(
                      room.id,
                      material.id,
                      "showerTrayCount",
                      newCount,
                    )
                  }
                  onZero={() => {
                    updateMaterial(room.id, material.id, "showerTray", false);
                    updateMaterial(room.id, material.id, "showerTrayCount", 0);
                  }}
                />
              )}
            </div>

            {/* Выбор типа поддона — появляется на новой строке */}
            {material.showerTray && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-300">
                <label className="block text-sm font-semibold tracking-wider mb-1 ml-1">
                  Тип поддона
                </label>
                <select
                  value={material.showerTrayType || "borderWithSlope"}
                  onChange={(e) =>
                    updateMaterial(
                      room.id,
                      material.id,
                      "showerTrayType",
                      e.target.value,
                    )
                  }
                  className="input-base"
                >
                  <option value="flatFloor">Ровный пол с разуклонкой</option>
                  <option value="borderWithSlope">
                    Бортик с разуклонкой (конверт)
                  </option>
                </select>
              </div>
            )}
          </div>
          {/* ДУШЕВОЙ ПОДДОН - END */}
        </div>
      )}
    </>
  );
};

export default Bathroom;
