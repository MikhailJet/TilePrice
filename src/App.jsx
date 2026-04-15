import { useState } from 'react'
import './App.css'

const TILE_PRICES = {
  '1200x600, 60x60': 50,
  '1200x200, 1000x200': 55,
  '1500x750 и более': 65,
  '2800x1200 и более': 80,
  '100x100, 800x800': 45,
  '600x150': 52,
  'менее чем 600x150': 60,
};

const CORNER_PRICES = {
  'external corner': 50,
};

const TILE_SIZES = Object.keys(TILE_PRICES);

const ROOM_TYPES = {
  bath: { label: 'Ванная, сан. узел', id: 'bath' },
  room: { label: 'Комната, кухня', id: 'room' },
  balcony: { label: 'Балкон', id: 'balcony' }
};

export default function TileQuiz() {
  const [step, setStep] = useState('selectFirstRoom'); // selectFirstRoom, addMaterials, results
  const [rooms, setRooms] = useState([]);
  const [nextRoomId, setNextRoomId] = useState(1);
  const [nextMaterialId, setNextMaterialId] = useState(1);
  const [errors, setErrors] = useState({});
  const [showAddRoomSelector, setShowAddRoomSelector] = useState(false);

  // Добавить новую комнату
  const addRoom = (roomType) => {
    const newRoom = {
      id: nextRoomId,
      roomType,
      materials: [
        {
          id: nextMaterialId,
          tileSize: TILE_SIZES[0],
          surface: 'floor',
          area: 0,
          externalCorners: 0,
        }
      ]
    };
    setRooms([...rooms, newRoom]);
    setNextRoomId(nextRoomId + 1);
    setNextMaterialId(nextMaterialId + 1);
    setShowAddRoomSelector(false);
    
    if (step === 'selectFirstRoom') {
      setStep('addMaterials');
    }
  };

  // Удалить комнату
  const removeRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
    if (rooms.length === 1) {
      setStep('selectFirstRoom');
    }
  };

  // Обновить материал в комнате
  const updateMaterial = (roomId, materialId, field, value) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            materials: room.materials.map(mat =>
              mat.id === materialId ? { ...mat, [field]: value } : mat
            )
          }
        : room
    ));
  };

  // Добавить материал к комнате
  const addMaterial = (roomId) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            materials: [
              ...room.materials,
              {
                id: nextMaterialId,
                tileSize: TILE_SIZES[0],
                surface: 'floor',
                area: 0,
                externalCorners: 0,
              }
            ]
          }
        : room
    ));
    setNextMaterialId(nextMaterialId + 1);
  };

  // Удалить материал из комнаты
  const removeMaterial = (roomId, materialId) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            materials: room.materials.filter(mat => mat.id !== materialId)
          }
        : room
    ));
  };

  // Проверить материалы всех комнат
  const validateCurrentMaterials = () => {
    const newErrors = {};
    let isValid = true;

    rooms.forEach(room => {
      room.materials.forEach(mat => {
        newErrors[mat.id] = {};
        
        if (!mat.tileSize) {
          newErrors[mat.id].tileSize = true;
          isValid = false;
        }
        if (!mat.surface) {
          newErrors[mat.id].surface = true;
          isValid = false;
        }
        if (mat.area === 0) {
          newErrors[mat.id].area = true;
          isValid = false;
        }
        if (mat.surface === 'walls' && mat.externalCorners === 0) {
          newErrors[mat.id].externalCorners = true;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  // Показать селектор для добавления новой комнаты
  const handleAddRoom = () => {
    if (!validateCurrentMaterials()) {
      return;
    }
    setShowAddRoomSelector(true);
    setErrors({});
  };

  // Рассчитать итоговую стоимость
  const calculateTotal = () => {
    let total = 0;
    const allRooms = [];

    rooms.forEach(room => {
      allRooms.push({
        roomType: ROOM_TYPES[room.roomType].label,
        materials: []
      });

      const lastRoom = allRooms[allRooms.length - 1];

      room.materials.forEach(mat => {
        let cost = 0;
        let description = `${mat.tileSize} (${mat.surface === 'floor' ? 'Пол' : 'Стены'})`;
        
        if (mat.surface === 'floor') {
          cost = mat.area * (TILE_PRICES[mat.tileSize] || 0);
          lastRoom.materials.push({
            description,
            area: mat.area,
            unitPrice: TILE_PRICES[mat.tileSize],
            cost
          });
        } else if (mat.surface === 'walls') {
          const areaCost = mat.area * (TILE_PRICES[mat.tileSize] || 0);
          const cornerCost = mat.externalCorners * (CORNER_PRICES['external corner'] || 0);
          cost = areaCost + cornerCost;
          lastRoom.materials.push({
            description,
            area: mat.area,
            unitPrice: TILE_PRICES[mat.tileSize],
            areaCost,
            corners: mat.externalCorners,
            cornerUnitPrice: CORNER_PRICES['external corner'],
            cornerCost,
            cost
          });

        } else if (mat.surface === 'both') {
          const areaCost = mat.area * (TILE_PRICES[mat.tileSize] || 0);
          const cornerCost = mat.externalCorners * (CORNER_PRICES['external corner'] || 0);
          cost = areaCost + cornerCost;
          lastRoom.materials.push({
            description,
            area: mat.area,
            unitPrice: TILE_PRICES[mat.tileSize],
            areaCost,
            corners: mat.externalCorners,
            cornerUnitPrice: CORNER_PRICES['external corner'],
            cornerCost,
            cost
          });  
        }
        
        total += cost;
      });
    });

    return { total, allRooms };
  };

  // Завершить расчет
  const submitCalculation = () => {
    if (!validateCurrentMaterials()) {
      return;
    }
    setShowAddRoomSelector(false);
    setStep('results');
    setErrors({});
  };

  // Начать сначала
  const handleReset = () => {
    setStep('selectFirstRoom');
    setRooms([]);
    setNextRoomId(1);
    setNextMaterialId(1);
    setErrors({});
    setShowAddRoomSelector(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-1 sm:p-4 font-sans">
      <div className="max-w-2xl w-full bg-white p-1 sm:p-6 md:p-8">
        
        {/* ШАГ 1: Выбор первой комнаты */}
        {step === 'selectFirstRoom' && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 ">Расчет стоимости плитки</h1>
            <h2 className="text-xl text-gray-600 mb-8">Где требуется укладка?</h2>
            
            <div className="space-y-3">
              {Object.values(ROOM_TYPES).map(roomType => (
                <button
                  key={roomType.id}
                  onClick={() => addRoom(roomType.id)}
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {roomType.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ШАГ 2: Добавление материалов для комнат */}
        {step === 'addMaterials' && rooms.length > 0 && (
          <div >
            <h2 className="text-2xl font-bold mb-6 text-center">Расчет стоимости плитки</h2>
            
            {/* Все комнаты для редактирования */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6 ">
              {rooms.map((room) => (
                <div key={room.id} className="shadow-lg border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-gray-100 relative">
                  {/* Кнопка удаления комнаты */}
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                      title="Удалить комнату"
                    >
                      ✕
                    </button>
                  )}
                  <h3 className="text-xl font-bold mb-6 text-gray-800 pr-8">{ROOM_TYPES[room.roomType].label}</h3>
                  
                  {/* Материалы комнаты */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6">
                    {room.materials.map((material, index) => (
                      <div key={material.id} className="relative border-2 border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white" style={{ animation: 'fadeIn 0.4s ease-in' }}>
                        {/* Кнопка удаления */}
                        {room.materials.length > 1 && (
                          <button
                            onClick={() => removeMaterial(room.id, material.id)}
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            title="Удалить материал"
                          >
                            ✕
                          </button>
                        )}

                        <h4 className="text-lg font-semibold mb-4 pr-8">Материал {index + 1}:</h4>

                        {/* Выбор материала */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">Выберите материал</label>
                          <select
                            value={material.tileSize}
                            onChange={(e) => updateMaterial(room.id, material.id, 'tileSize', e.target.value)}
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:border-gray-500"
                          >
                            {TILE_SIZES.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                          {errors[material.id]?.tileSize && <p className="text-red-500 text-xs mt-1">Выберите материал</p>}
                        </div>

                        {/* Назначение */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">Выберите назначение</label>
                          <div className="flex gap-2">
                            {['floor', 'walls', 'both'].map(option => {
                              const labels = { floor: 'Пол', walls: 'Стены', both: 'Пол + стены' };
                              return (
                                <button
                                  key={option}
                                  onClick={() => updateMaterial(room.id, material.id, 'surface', option)}
                                  className={`flex-1 p-2 border-2 rounded-lg transition font-medium ${
                                    material.surface === option
                                      ? 'border-gray-900 bg-gray-500 text-white transition duration-400 ease-in'
                                      : 'border-gray-500 bg-white text-gray-800 hover:text-gray-600 hover:border-gray-400'
                                  }`}
                                >
                                  {labels[option]}
                                </button>
                              );
                            })}
                          </div>
                          {errors[material.id]?.surface && <p className="text-red-500 text-xs mt-1">Выберите назначение</p>}
                        </div>

                        {/* Площадь укладки */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">Площадь укладки (м²)</label>
                          <input
                            type="number"
                            value={material.area === 0 ? '' : material.area}
                            onChange={(e) => {
                              let value = parseFloat(e.target.value) || 0;
                              if (value < 0) value = 0;
                              const rounded = Math.round(value * 100) / 100;
                              updateMaterial(room.id, material.id, 'area', rounded);
                            }}
                            step="0.01"
                            min="0"
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:border-gray-700"
                            placeholder="0"
                          />
                          {errors[material.id]?.area && <p className="text-red-500 text-xs mt-1">Укажите площадь</p>}
                        </div>

                        {/* Внешние углы (для стен и пол+стены) */}
                        { (
                    <div className={`overflow-hidden transition-all duration-400 ease-in ${
                      (material.surface === 'walls' || material.surface === 'both')
                        ? 'mb-4 max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 pointer-events-none'
                    }`}>                     
                         <label className="block text-sm font-semibold mb-2">Внешние углы (м.п.)</label>
                            <input
                              type="number"
                              value={material.externalCorners === 0 ? '' : material.externalCorners}
                              onChange={(e) => {
                                let value = parseFloat(e.target.value) || 0;
                                if (value < 0) value = 0;
                                const rounded = Math.round(value * 100) / 100;
                                updateMaterial(room.id, material.id, 'externalCorners', rounded);
                              }}
                              step="0.01"
                              min="0"
                              className="w-full p-3 border rounded shadow-sm focus:outline-none focus:border-gray-700"
                              placeholder="0.00"
                            />
                            {errors[material.id]?.externalCorners && <p className="text-red-500 text-xs mt-1">Укажите углы</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Кнопка добавить материал */}
                  <button
                    onClick={() => addMaterial(room.id)}
                    className="w-full bg-gray-500 hover:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
                  >
                    + Добавить еще материал
                  </button>
                </div>
              ))}
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddRoom}
                className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                + Добавить комнату
              </button>
              <button
                onClick={submitCalculation}
                className="flex-1 bg-gray-950 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Рассчитать стоимость
              </button>
            </div>

            {/* Селектор для добавления новой комнаты */}
            { (
              <div className={`border-2 border-gray-400 rounded-xl p-4 sm:p-5 md:p-6 bg-gray-50 transition-all duration-500 ease-in overflow-hidden ${
                    showAddRoomSelector
                    ? 'mb-4 sm:mb-5 md:mb-6 max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}>
                <h3 className="text-lg font-semibold mb-4">Выберите тип комнаты:</h3>
                <div className="space-y-2">
                  {Object.values(ROOM_TYPES).map(roomType => (
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

        {/* ШАГ 3: Итоговый расчет */}
        {step === 'results' && (() => {
          const { total, allRooms } = calculateTotal();
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">Итоговый расчет</h2>
              
              <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6">
                {allRooms.map((roomData, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg mb-3">{roomData.roomType}</h3>
                    <div className="space-y-2">
                      {roomData.materials.map((item, matIdx) => (
                        <div key={matIdx} className="text-sm border-b pb-2 last:border-b-0">
                          <p className="font-semibold mb-1">{item.description}</p>
                          {item.areaCost !== undefined ? (
                            <>
                              <p className="text-gray-600">Площадь: <span className="font-semibold">{item.area} м²</span> × <span className="font-semibold">{item.unitPrice}₾</span> = <span className="text-gray-950 font-bold">{item.areaCost}₾</span></p>
                              {item.cornerCost > 0 && (
                                <p className="text-gray-600">Углы: <span className="font-semibold">{item.corners} м.п.</span> × <span className="font-semibold">{item.cornerUnitPrice}₾</span> = <span className="text-gray-950 font-bold">{item.cornerCost}₾</span></p>
                              )}
                              <p className="text-gray-700 font-bold">Итого: <span className="text-gray-950">{item.cost}₾</span></p>
                            </>
                          ) : (
                            <p className="text-gray-600">Площадь: <span className="font-semibold">{item.area} м²</span> × <span className="font-semibold">{item.unitPrice}₾</span> = <span className="text-gray-950 font-bold">{item.cost}₾</span></p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 p-3 sm:p-4 md:p-5 rounded-xl border-2 border-gray-200 mb-4 sm:mb-5 md:mb-6">
                <p className="text-2xl font-bold text-center">Общая стоимость: <span className="text-gray-950">{total}₾</span></p>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Начать сначала
              </button>
            </div>
          );
        })()}

      </div>
    </div>
  );
}