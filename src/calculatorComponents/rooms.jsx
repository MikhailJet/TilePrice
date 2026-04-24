import React, { useState, useEffect } from "react";
import {
  TILE_PRICES,
  ROOM_TYPES,
  CORNER_PRICES,
  TILE_SIZES,
} from "../constants";
import Items from "./items.jsx";
import { PRODUCTS_TYPES } from "../constants";

function Rooms({ step, setStep, onCalculate }) {
  const [rooms, setRooms] = useState([]);
  const [nextRoomId, setNextRoomId] = useState(1);
  const [nextMaterialId, setNextMaterialId] = useState(1);
  const [showAddRoomSelector, setShowAddRoomSelector] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [errors, setErrors] = useState({});

  const addRoom = (roomType) => {
    const newRoom = {
      id: nextRoomId,
      roomType,
      materials: [],
    };

    setRooms((prev) => [...prev, newRoom]);
    setNextRoomId((prev) => prev + 1);
    setShowAddRoomSelector(false);
    setErrors({});

    // Show position selector for the new room
    setItems(true);
    setCurrentRoomId(nextRoomId);
  };

  const removeRoom = (roomId) => {
    setRooms((prev) => {
      const nextRooms = prev.filter((room) => room.id !== roomId);
      if (nextRooms.length === 0) {
        setItems(false);
        setCurrentRoomId(null);
      }
      return nextRooms;
    });
  };

  const handleAddMaterial = (roomId) => {
    setItems(true);
    setCurrentRoomId(roomId);
  };

  const removeMaterial = (roomId, materialId) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              materials: room.materials.filter((mat) => mat.id !== materialId),
            }
          : room,
      ),
    );
  };

  const updateMaterial = (roomId, materialId, field, value) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              materials: room.materials.map((mat) =>
                mat.id === materialId ? { ...mat, [field]: value } : mat,
              ),
            }
          : room,
      ),
    );
    console.log(rooms);
  };

  // products are stored separately from rooms
  const addProduct = (productId) => {
    const newProduct = {
      id: nextMaterialId,
      productType: productId,
      count: 1,
    };

    setProducts((prev) => [...prev, newProduct]);
    setNextMaterialId((prev) => prev + 1);
    setShowProductSelector(false);
  };

  const updateProduct = (productId, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p)),
    );
  };

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleProductSelect = (id) => {
    addProduct(id);
    setShowProductSelector(false);
  };

  // Close modal on Escape
  useEffect(() => {
    if (!showProductSelector) return;

    const onKey = (e) => {
      if (e.key === "Escape") setShowProductSelector(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showProductSelector]);

  const handleBackdropClick = () => {
    // only allow backdrop close on desktop widths
    try {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const DESKTOP_MIN = 768; // px, adjust if needed
      if (width >= DESKTOP_MIN) setShowProductSelector(false);
    } catch (e) {
      // in SSR or tests - do nothing
    }
  };

  const validateCurrentMaterials = () => {
    const newErrors = {};
    let isValid = true;

    rooms.forEach((room) => {
      room.materials.forEach((mat) => {
        newErrors[mat.id] = {};
        if (
          mat.surface === "floor" ||
          mat.surface === "walls" ||
          mat.surface === "both"
        ) {
          if (!mat.tileSize) {
            newErrors[mat.id].tileSize = true;
            isValid = false;
          }
          if (!mat.surface) {
            newErrors[mat.id].surface = true;
            isValid = false;
          }
          if (
            room.roomType === "balcony" &&
            mat.surface === "floor" &&
            mat.slopeType === ""
          ) {
            newErrors[mat.id].slopeType = true;
            isValid = false;
          }

          if (mat.baseboardEnabled && !(+mat.baseboardLength > 0)) {
            newErrors[mat.id].baseboardLength = true;
            isValid = false;
          }
          // area обязательна только для поверхностей, которые имеют площадь
          if (
            (mat.surface === "walls" ||
              mat.surface === "floor" ||
              mat.surface === "both") &&
            !(+mat.area > 0)
          ) {
            newErrors[mat.id].area = true;
            isValid = false;
          }
          if (
            mat.surface !== "product" &&
            !(+mat.hole > 0) &&
            room.roomType !== "room"
          ) {
            newErrors[mat.id].hole = true;
            isValid = false;
          }
          if (
            (mat.surface === "walls" || mat.surface === "both") &&
            mat.externalCorners === 0
          ) {
            newErrors[mat.id].externalCorners = true;
            isValid = false;
          }
        } else if (mat.surface === "backsplash") {
          if (!mat.backsplashLength) {
            newErrors[mat.id].backsplashLength = true;
            isValid = false;
          }
        } else if (mat.surface === "countertop") {
          if (!mat.countertopLength) {
            newErrors[mat.id].countertopLength = true;
            isValid = false;
          }
        } else if (mat.surface === "windowsill") {
          if (!mat.windowsillLength) {
            newErrors[mat.id].windowsillLength = true;
            isValid = false;
          }
        }
      });
    });

    setErrors(newErrors);
    console.log("Validation result:", isValid, newErrors);
    return isValid;
  };

  const handleAddRoom = () => {
    if (!validateCurrentMaterials()) {
      return;
    }
    setShowAddRoomSelector(true);
    setErrors({});
  };

  const submitCalculation = () => {
    if (!validateCurrentMaterials()) {
      return;
    }
    setShowAddRoomSelector(false);
    onCalculate(rooms);
  };

  return (
    <>
      {/* ЗАГОЛОВОК + ОСНОВНОЕ ОКНО С КОМНАТАМИ */}
      <div
        className={`${showProductSelector ? "filter blur-md" : ""}`}
        aria-hidden={showProductSelector}
      >
        <h1 className="text-3xl font-bold mb-2 text-center">
          Расчет стоимости плитки
        </h1>
        <h2 className="text-xl text-gray-600 mb-8 text-center">
          Где требуется укладка?
        </h2>

        {products.length === 0 &&
          rooms.length === 0 &&
          !items &&
          !showProductSelector && (
            <div className="space-y-3 mb-3">
              {Object.values(ROOM_TYPES).map((roomType) => (
                <button
                  key={roomType.id}
                  onClick={() => addRoom(roomType.id)}
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {roomType.label}
                </button>
              ))}
            </div>
          )}

        {/* КОМНАТЫ */}
        {(rooms.length > 0 || products.length > 0 || items) && (
          <div>
            <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6 ">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="shadow-lg border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-gray-100 relative"
                >
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                      title="Удалить комнату"
                    >
                      ✕
                    </button>
                  )}
                  <h3 className="text-xl font-bold mb-6 text-gray-800 pr-8">
                    {ROOM_TYPES[room.roomType].label}
                  </h3>

                  {/* Позиции внутри комнаты */}
                  <Items
                    room={room}
                    currentRoomId={currentRoomId}
                    items={items}
                    setItems={setItems}
                    setCurrentRoomId={setCurrentRoomId}
                    setRooms={setRooms}
                    rooms={rooms}
                    nextMaterialId={nextMaterialId}
                    setNextMaterialId={setNextMaterialId}
                    removeMaterial={removeMaterial}
                    updateMaterial={updateMaterial}
                    errors={errors}
                    handleAddMaterial={handleAddMaterial}
                    showAddRoomSelector={showAddRoomSelector}
                  />
                </div>
              ))}
            </div>

            {/* СЕЛЕКТОР ВЫБОРА ТИПА КОМНАТЫ*/}
            {showAddRoomSelector && (
              <div className="border-2 border-gray-400 rounded-xl p-4 sm:p-5 md:p-6 bg-gray-50 mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Выберите тип комнаты:
                </h3>
                <div className="space-y-2">
                  {Object.values(ROOM_TYPES).map((roomType) => (
                    <button
                      key={roomType.id}
                      onClick={() => addRoom(roomType.id)}
                      className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition"
                    >
                      {roomType.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddRoomSelector(false)}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition mt-3"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
        )}

        {/* СЕКЦИЯ ИЗДЕЛИЙ - рендерится после списка комнат (не привязана к комнате) */}
        {products.length > 0 && (
          <div>
            <div className="mt-6 mb-6 shadow-lg border-gray-200 rounded-xl p-4 sm:p-5 md:p-6s bg-gray-100 relative">
              {products.length > 0 && (
                <h3 className="text-xl font-bold mb-4">Изделия</h3>
              )}

              {/* Добавленные изделия */}
              <div className="space-y-3 mb-4 ">
                {products.map((p) => (
                  <div
                    key={p.id}
                    //className="border rounded-xl p-4 bg-white flex items-start justify-between"
                    className="flex items-start justify-between border-2 border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white"
                    style={{ animation: "fadeIn 0.4s ease-in" }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {PRODUCTS_TYPES[p.productType].label}
                      </div>
                      {p.productType === "sink" && (
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">
                            Размер раковины
                          </label>
                          <select
                            value={p.sinkSize || "upTo120"}
                            onChange={(e) =>
                              updateProduct(p.id, "sinkSize", e.target.value)
                            }
                            className="input-base"
                          >
                            <option value="upTo120">Ширина до 120 см</option>
                            <option value="over120">Ширина более 120 см</option>
                          </select>
                        </div>
                      )}
                      <div className="mt-2">
                        <label className="block text-sm text-gray-600 mb-1">
                          Количество
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={p.count || 1}
                          onChange={(e) =>
                            updateProduct(
                              p.id,
                              "count",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="input-base"
                        />
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2"
                        //absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition
                        title="Удалить изделие"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="space-y-3 mb-4 ">
          <div className="flex gap-3 mb-6">
            {(rooms.length > 0 || items || products.length > 0) &&
              !items &&
              !showAddRoomSelector && (
                <button
                  onClick={handleAddRoom}
                  className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  {rooms.length > 0 ? "+Добавить комнату" : "Выбрать комнату"}
                </button>
              )}

            {/* ДОБАВИТЬ ИЗДЕЛИЕ */}
            {!showAddRoomSelector && (
              <button
                onClick={() => setShowProductSelector(true)}
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {rooms.length !== 0 || products.length !== 0
                  ? "+Добавить изделие"
                  : "Изделия"}
              </button>
            )}
          </div>
        </div>
        {/* КНОПКИ +Добавить комнату и =Рассчитать стоимость */}
        {(rooms.length > 0 || items || products.length !== 0) &&
          !items &&
          !showAddRoomSelector && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={submitCalculation}
                className="flex-1 bg-gray-950 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Рассчитать стоимость
              </button>
            </div>
          )}
      </div>

      {/* Modal overlay for product selector (renders above everything) */}
      {showProductSelector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-opacity-30" />
          <div
            className="relative z-10 w-full max-w-3xl mx-4 sm:mx-6 md:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-auto">
              <h4 className="text-lg font-semibold mb-4">Выберите изделие</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(PRODUCTS_TYPES).map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-white hover:border-indigo-300 transition"
                  >
                    <div className="w-full h-28 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                      Фото
                    </div>
                    <span className="font-semibold text-center mb-3">
                      {product.label}
                    </span>
                    <button
                      onClick={() => handleProductSelect(product.id)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Добавить
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowProductSelector(false)}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition mt-4"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Rooms;
