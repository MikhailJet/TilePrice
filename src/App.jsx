import { useState } from 'react'
import './App.css'
import Rooms from './calculatorComponents/rooms.jsx';
import Products from './products.jsx';
import { ROOM_TYPES, TILE_PRICES, CORNER_PRICES } from './constants';

export default function TileQuiz() {
  const [step, setStep] = useState('addMaterials');
  const [results, setResults] = useState(null);

  const handleCalculate = (rooms) => {
    const { total, allRooms } = calculateTotal(rooms);
    setResults({ total, allRooms });
    setStep('results');
  };

  const calculateTotal = (rooms) => {
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

  const handleReset = () => {
    setStep('selectFirstRoom');
    setResults(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-1 sm:p-4 font-sans">
      <div className="max-w-2xl w-full bg-white p-1 sm:p-6 md:p-8">
        {step !== 'results' && (
          <Rooms
            step={step}
            setStep={setStep}
            onCalculate={handleCalculate}
          />
        )}

        {step === 'results' && results && (
          <div>
            <h2 className="text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">Итоговый расчет</h2>

            <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6">
              {results.allRooms.map((roomData, idx) => (
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
              <p className="text-2xl font-bold text-center">Общая стоимость: <span className="text-gray-950">{results.total}₾</span></p>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Начать сначала
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
