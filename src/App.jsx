import { useState } from 'react'
import './App.css'


// Цены за м2 для разных форматов
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

export default function TileQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    surface: '', // floor, walls, both
    isSameTile: null, // boolean
    floorSize: '',
    wallSize: '',
    floorArea: 0,
    wallArea: 0,
    externalCorners: 0,
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const reset = () => {
    setAnswers({ surface: '', isSameTile: null, floorSize: '', wallSize: '', floorArea: 0, wallArea: 0, externalCorners: 0 });
    setStep(1);
  };

  // Расчет итогов
  const calculateTotal = () => {
    let costs = {
      floorCost: 0,
      wallsCost: 0,
      cornerCost: 0,
    };

    if (answers.surface === 'floor' || answers.surface === 'both') {
      costs.floorCost = answers.floorArea * (TILE_PRICES[answers.floorSize] || 0);
    }
    if (answers.surface === 'walls' || answers.surface === 'both') {
      const wallSizeKey = answers.surface === 'walls' ? answers.wallSize : (answers.isSameTile ? answers.floorSize : answers.wallSize);
      costs.wallsCost = answers.wallArea * (TILE_PRICES[wallSizeKey] || 0);
    }
    if (answers.externalCorners > 0) {
      costs.cornerCost = answers.externalCorners * (CORNER_PRICES['external corner'] || 0);
    }
    
    return {
      ...costs,
      total: costs.floorCost + costs.wallsCost + costs.cornerCost
    };
  };

  const surfaceName = (name) => {
    return name === 'both' ? 'Стены и пол' 
    : name === 'floor' ? 'Пол'
    : 'Стены';
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        {/* Шаг 1: Выбор поверхности */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Где требуется укладка?</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setAnswers({...answers, surface: 'floor'}); nextStep(); }} className="p-4 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition">Только пол</button>
              <button onClick={() => { setAnswers({...answers, surface: 'walls'}); nextStep(); }} className="p-4 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition">Только стены</button>
              <button onClick={() => { setAnswers({...answers, surface: 'both'}); nextStep(); }} className="p-4 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition">Пол + Стены</button>
            </div>
          </div>
        )}

        {/* Шаг 2: Выбор типа плитки (для Пол + Стены) */}
        {step === 2 && answers.surface === 'both' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Плитка одинаковая для пола и стен?</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setAnswers({...answers, isSameTile: true}); nextStep(); }} className="p-4 border-2 border-green-500 rounded-xl hover:bg-green-50 transition">Да, одинаковая</button>
              <button onClick={() => { setAnswers({...answers, isSameTile: false}); nextStep(); }} className="p-4 border-2 border-orange-500 rounded-xl hover:bg-orange-50 transition">Нет, разная</button>
            </div>
          </div>
        )}

        {/* Шаг 3: Размер плитки */}
        {((step === 2 && answers.surface !== 'both') || (step === 3 && answers.surface === 'both')) && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Размер плитки {answers.isSameTile === false ? "(для ПОЛА)" : ""}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {TILE_SIZES.map(size => (
                <button key={size} onClick={() => { 
                  if (answers.surface === 'walls') {
                    setAnswers({...answers, wallSize: size});
                    setStep(5);
                  } else {
                    setAnswers({...answers, floorSize: size}); 
                    setStep(answers.isSameTile === false ? 4 : 5);
                  }
                }} className="p-2 border rounded-lg hover:bg-gray-50 text-sm">{size}</button>
              ))}
            </div>
          </div>
        )}

        {/* Шаг 4: Размер плитки для стен (если разная) */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Размер плитки для СТЕН</h2>
            <div className="grid grid-cols-1 gap-2">
              {TILE_SIZES.map(size => (
                <button key={size} onClick={() => { setAnswers({...answers, wallSize: size}); nextStep(); }} className="p-2 border rounded-lg hover:bg-gray-50 text-sm">{size}</button>
              ))}
            </div>
          </div>
        )}

        {/* Шаг 5: Площадь */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Укажите площадь (м²)</h2>
            {(answers.surface === 'floor' || answers.surface === 'both') && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Площадь пола:</label>
                <select onChange={(e) => setAnswers({...answers, floorArea: Number(e.target.value)})} value={answers.floorArea} className="w-full p-2 border rounded shadow-sm">
                  {[...Array(501)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            )}
            {(answers.surface === 'walls' || answers.surface === 'both') && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Площадь стен:</label>
                <select onChange={(e) => setAnswers({...answers, wallArea: Number(e.target.value)})} value={answers.wallArea} className="w-full p-2 border rounded shadow-sm">
                  {[...Array(501)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            )}
            <button onClick={() => setStep(answers.surface !== 'floor' ? 6 : 7)} className="w-full bg-blue-600 text-white p-3 rounded-xl">Далее</button>
          </div>
        )}

        {/* Шаг 6: Углы (только если есть стены) */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Внешние углы</h2>
            <label className="block text-sm mb-2">Количество внешних углов (м.п.):</label>
            <select onChange={(e) => setAnswers({...answers, externalCorners: Number(e.target.value)})} value={answers.externalCorners} className="w-full p-2 border rounded mb-4">
              {[...Array(501)].map((_, i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded-xl">Посчитать итог</button>
          </div>
        )}

        {/* Результат */}
        {step === 7 && (() => {
          const costs = calculateTotal();
          return (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Итоговый расчет</h2>
              <div className="bg-gray-50 p-4 rounded-xl text-left mb-6 space-y-2">
                <p>Поверхность: <strong>{surfaceName(answers.surface)}</strong></p>
                <p>Общая площадь: <strong>{answers.floorArea + answers.wallArea} м²</strong></p>
                {answers.externalCorners > 0 && <p>Углы: <strong>{answers.externalCorners} м.п.</strong></p>}
                <hr />
                {costs.floorCost > 0 && <p>Стоимость пола: <span className="font-bold text-blue-500">{costs.floorCost}₾</span></p>}
                {costs.wallsCost > 0 && <p>Стоимость стен: <span className="font-bold text-blue-500">{costs.wallsCost}₾</span></p>}
                {costs.cornerCost > 0 && <p>Стоимость углов: <span className="font-bold text-blue-500">{costs.cornerCost}₾</span></p>}
                <hr />
                <p className="text-xl">Итого: <span className="font-bold text-blue-700">{costs.total}₾</span></p>
              </div>
              <button onClick={reset} className="text-blue-500 hover:underline">Начать сначала</button>
            </div>
          );
        })()}

      </div>
    </div>
  );
}