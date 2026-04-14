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

export default function TileQuiz() {
  const [submitted, setSubmitted] = useState(false);
  const [materials, setMaterials] = useState([
    {
      id: 1,
      tileSize: TILE_SIZES[0],
      designation: 'floor',
      area: 0,
      externalCorners: 0,
    }
  ]);
  const [nextId, setNextId] = useState(2);
  const [errors, setErrors] = useState({});

  const updateMaterial = (id, field, value) => {
    setMaterials(materials.map(mat =>
      mat.id === id ? { ...mat, [field]: value } : mat
    ));
  };

  const addMaterial = () => {
    setMaterials([...materials, {
      id: nextId,
      tileSize: TILE_SIZES[0],
      designation: 'floor',
      area: 0,
      externalCorners: 0,
    }]);
    setNextId(nextId + 1);
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter(mat => mat.id !== id));
  };

  const validateMaterials = () => {
    const newErrors = {};
    let isValid = true;

    materials.forEach(mat => {
      newErrors[mat.id] = {};
      
      if (!mat.tileSize) {
        newErrors[mat.id].tileSize = true;
        isValid = false;
      }
      if (!mat.designation) {
        newErrors[mat.id].designation = true;
        isValid = false;
      }
      if (mat.area === 0) {
        newErrors[mat.id].area = true;
        isValid = false;
      }
      if (mat.designation === 'walls' && mat.externalCorners === 0) {
        newErrors[mat.id].externalCorners = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const calculateTotal = () => {
    let total = 0;
    const breakdown = [];

    materials.forEach(mat => {
      let cost = 0;
      let description = `${mat.tileSize} (${mat.designation === 'floor' ? 'Пол' : 'Стены'})`;
      
      if (mat.designation === 'floor') {
        cost = mat.area * (TILE_PRICES[mat.tileSize] || 0);
        breakdown.push({
          description,
          area: mat.area,
          unitPrice: TILE_PRICES[mat.tileSize],
          cost
        });
      } else if (mat.designation === 'walls') {
        const areaCost = mat.area * (TILE_PRICES[mat.tileSize] || 0);
        const cornerCost = mat.externalCorners * (CORNER_PRICES['external corner'] || 0);
        cost = areaCost + cornerCost;
        breakdown.push({
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

    return { total, breakdown };
  };

  const handleSubmit = () => {
    if (!validateMaterials()) {
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setMaterials([
      {
        id: 1,
        tileSize: TILE_SIZES[0],
        designation: 'floor',
        area: 0,
        externalCorners: 0,
      }
    ]);
    setNextId(2);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        
        {/* Экран 1: Форма со секциями материалов */}
        {!submitted && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Расчет стоимости плитки</h2>
            
            <div className="space-y-6">
              {materials.map((material) => (
                <div key={material.id} className="relative border-2 border-gray-200 rounded-xl p-6">
                  {/* Кнопка удаления */}
                  <button
                    onClick={() => removeMaterial(material.id)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Удалить материал"
                  >
                    ✕
                  </button>

                  <h3 className="text-lg font-semibold mb-4 pr-8">Материал {materials.indexOf(material) + 1}</h3>

                  {/* Выбор материала */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Выберите материал</label>
                    <select
                      value={material.tileSize}
                      onChange={(e) => updateMaterial(material.id, 'tileSize', e.target.value)}
                      className="w-full p-2 border rounded shadow-sm"
                    >
                      {TILE_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Назначение */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Выберите назначение</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateMaterial(material.id, 'designation', 'floor')}
                        className={`flex-1 p-2 border-2 rounded-lg transition ${
                          material.designation === 'floor' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        Пол
                      </button>
                      <button
                        onClick={() => updateMaterial(material.id, 'designation', 'walls')}
                        className={`flex-1 p-2 border-2 rounded-lg transition ${
                          material.designation === 'walls' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        Стены
                      </button>
                    </div>
                  </div>

                  {/* Площадь укладки */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Площадь укладки (м²)</label>
                    <select
                      value={material.area}
                      onChange={(e) => updateMaterial(material.id, 'area', Number(e.target.value))}
                      className="w-full p-2 border rounded shadow-sm"
                    >
                      <option value={0}>Выберите площадь</option>
                      {[...Array(500)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Внешние углы (только для стен) */}
                  {material.designation === 'walls' && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Внешние углы (м.п.)</label>
                      <input
                        type="number"
                        value={material.externalCorners === 0 ? '' : material.externalCorners}
                        onChange={(e) => {
                            let value = parseFloat(e.target.value) || 0;
                            if (value < 0) value = 0;
                            const rounded = Math.round(value * 100) / 100;
                            updateMaterial(material.id, 'externalCorners', rounded);
                          }}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border rounded shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Кнопки действий */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={addMaterial}
                className="flex-1 bg-gray-500 text-white p-3 rounded-xl font-semibold hover:bg-gray-600"
              >
                + Добавить еще материал
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Рассчитать стоимость
              </button>
            </div>
          </div>
        )}

        {/* Экран 2: Итоговая смета */}
        {submitted && (() => {
          const { total, breakdown } = calculateTotal();
          return (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-green-600">Итоговый расчет</h2>
              <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-3">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="border-b pb-3 last:border-b-0">
                    <p className="font-semibold text-sm mb-2">{item.description}</p>
                    {item.cost ? (
                      <>
                        <p className="text-sm">Площадь: <span className="font-semibold">{item.area} м²</span> × <span className="font-semibold">{item.unitPrice}₾</span> = <span className="text-blue-500 font-bold">{item.areaCost || item.cost}₾</span></p>
                        {item.cornerCost > 0 && (
                          <p className="text-sm">Углы: <span className="font-semibold">{item.corners} м.п.</span> × <span className="font-semibold">{item.cornerUnitPrice}₾</span> = <span className="text-blue-500 font-bold">{item.cornerCost}₾</span></p>
                        )}
                        {item.cornerCost > 0 && (
                          <p className="text-sm font-bold">Итого: <span className="text-blue-700">{item.cost}₾</span></p>
                        )}
                      </>
                    ) : null}
                  </div>
                ))}
                <div className="border-t-2 pt-3 mt-3">
                  <p className="text-xl">Общая стоимость: <span className="font-bold text-blue-700">{total}₾</span></p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700"
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