import React from "react";
import { useState } from "react";
import { TILE_SIZES, ITEM_TYPES, PRODUCTS_TYPES } from "../constants";
import Balcony from "./rooms/balcony.jsx";
import Bathroom from "./rooms/bathroom.jsx";
import RoomKitchen from "./rooms/roomKitchen.jsx";
import ExtraItems from "./extraItems.jsx";

function Items({
  room,
  currentRoomId,
  items,
  setItems,
  setCurrentRoomId,
  setRooms,
  rooms,
  nextMaterialId,
  setNextMaterialId,
  removeMaterial,
  updateMaterial,
  errors,
  handleAddMaterial,
  showAddRoomSelector,
}) {
  const addItem = (itemId) => {
    const newMaterial = {
      id: nextMaterialId,
      tileSize: TILE_SIZES[0],
      surface: itemId,
      area: 0,
      externalCorners: 0,
      groutType: "epoxy",
      slopeType: "",
      slopeLength: 0,
      hole: 0,
      baseboardEnabled: false,
      baseboardLength: 0,
      externalCornersCount: 0,
      windowReveal: 0,
      shelfEnabled: false,
      shelfCount: 0,
    };

    // Инициализируем специфичные для поверхности поля
    if (itemId === "backsplash") {
      newMaterial.backsplashLength = 0;
    }
    if (itemId === "countertop") {
      newMaterial.countertopLength = 0;
    }
    if (itemId === "windowsill") {
      newMaterial.windowsillLength = 0;
    }

    setRooms((prev) =>
      prev.map((r) =>
        r.id === currentRoomId
          ? { ...r, materials: [...r.materials, newMaterial] }
          : r,
      ),
    );
    setNextMaterialId((prev) => prev + 1);
    setItems(false);
    setCurrentRoomId(null);
  };

  return (
    <div>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6">
        {room.materials.map((material, index) => {
          const isBalconyFloor =
            room.roomType === "balcony" && material.surface === "floor";
          const isBathroom = room.roomType === "bath";
          const isRoomKitchen = room.roomType === "room";
          const mainSurfaces =
            material.surface === "walls" || material.surface === "floor";
          {
            /*const extraItems =
            material.surface === "island" ||
            material.surface === "backsplash" ||
            material.surface === "countertop" ||
            material.surface === "windowsill";*/
          }
          return (
            <div
              key={material.id}
              className="relative border-2 border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white"
              style={{ animation: "fadeIn 0.4s ease-in" }}
            >
              {room.materials.length > 1 && (
                <button
                  onClick={() => removeMaterial(room.id, material.id)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                  title="Удалить материал"
                >
                  ✕
                </button>
              )}

              <h4 className="text-lg font-semibold mb-4 pr-8">
                {ITEM_TYPES[material.surface].label} — {"материал"} {index + 1}:
              </h4>

              {/* ****************************** ОБЩИЕ ПОЛЯ ****************************** */}
              {mainSurfaces && (
                <>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        Выберите материал
                      </label>
                      <select
                        value={material.tileSize}
                        onChange={(e) =>
                          updateMaterial(
                            room.id,
                            material.id,
                            "tileSize",
                            e.target.value,
                          )
                        }
                        className="input-base"
                      >
                        {TILE_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      {errors[material.id]?.tileSize && (
                        <p className="text-red-500 text-xs mt-1">
                          Выберите материал
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        Площадь укладки (м²)
                      </label>
                      <input
                        type="number"
                        value={material.area === 0 ? "" : material.area}
                        onChange={(e) => {
                          let value = parseFloat(e.target.value) || 0;
                          if (value < 0) value = 0;
                          const rounded = Math.round(value * 100) / 100;
                          updateMaterial(room.id, material.id, "area", rounded);
                        }}
                        step="0.01"
                        min="0"
                        className="input-base"
                        placeholder="0"
                      />
                      {errors[material.id]?.area && (
                        <p className="text-red-500 text-xs mt-1">
                          Укажите площадь
                        </p>
                      )}
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-400 ease-in ${
                        material.surface === "walls" ||
                        material.surface === "both"
                          ? "mb-4 max-h-96 opacity-100"
                          : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <label className="block text-sm font-semibold mb-2">
                        Внешние углы (м.п.)
                      </label>
                      <input
                        type="number"
                        value={
                          material.externalCorners === 0
                            ? ""
                            : material.externalCorners
                        }
                        onChange={(e) => {
                          let value = parseFloat(e.target.value) || 0;
                          if (value < 0) value = 0;
                          const rounded = Math.round(value * 100) / 100;
                          updateMaterial(
                            room.id,
                            material.id,
                            "externalCorners",
                            rounded,
                          );
                        }}
                        step="0.01"
                        min="0"
                        className="input-base"
                        placeholder="0.00"
                      />
                      {errors[material.id]?.externalCorners && (
                        <p className="text-red-500 text-xs mt-1">
                          Укажите углы
                        </p>
                      )}
                    </div>
                  </div>

                  {/****************************** КОМНАТЫ *************************/}

                  {isBalconyFloor && (
                    <Balcony
                      material={material}
                      room={room}
                      updateMaterial={updateMaterial}
                      errors={errors}
                    />
                  )}
                  {isBathroom && (
                    <Bathroom
                      material={material}
                      room={room}
                      updateMaterial={updateMaterial}
                      errors={errors}
                    />
                  )}
                  {isRoomKitchen && (
                    <RoomKitchen
                      material={material}
                      room={room}
                      updateMaterial={updateMaterial}
                      errors={errors}
                    />
                  )}
                </>
              )}
              {material.surface !== "product" && (
                <ExtraItems
                  material={material}
                  room={room}
                  updateMaterial={updateMaterial}
                  errors={errors}
                />
              )}

              {material.surface === "product" && (
                <div className="mt-4">
                  {material.productType === "sink" && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        Размер раковины
                      </label>
                      <select
                        value={material.sinkSize || "upTo120"}
                        onChange={(e) =>
                          updateMaterial(
                            room.id,
                            material.id,
                            "sinkSize",
                            e.target.value,
                          )
                        }
                        className="input-base"
                      >
                        <option value="upTo120">Ширина до 120 см</option>
                        <option value="over120">Ширина более 120 см</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Количество (шт)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={material.count || 1}
                      onChange={(e) =>
                        updateMaterial(
                          room.id,
                          material.id,
                          "count",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="input-base"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {room.id === currentRoomId && items && (
        <div className="border-2 border-gray-400 rounded-xl p-4 sm:p-5 md:p-6 bg-gray-50 mb-6">
          <h4 className="text-lg font-semibold mb-4">Добавить поверхность:</h4>
          <div className="space-y-2">
            {Object.values(ITEM_TYPES).map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item.id)}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setItems(false);
              setCurrentRoomId(null);
              // Remove the room if no materials added yet (new room)
              const room = rooms.find((r) => r.id === currentRoomId);
              if (room && room.materials.length === 0) {
                setRooms((prev) => prev.filter((r) => r.id !== currentRoomId));
              }
            }}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition mt-3"
          >
            Отмена
          </button>
        </div>
      )}

      {!items && !showAddRoomSelector && (
        <div>
          <button
            onClick={() => handleAddMaterial(room.id)}
            className="w-full bg-gray-500 hover:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            + Добавить материал
          </button>
        </div>
      )}
    </div>
  );
}

export default Items;
