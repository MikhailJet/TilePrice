import React from "react";

export default function Results({ results, onReset }) {
  if (!results) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">
        Итоговый расчет
      </h2>

      <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-5 md:mb-6">
        {results.allRooms.map((roomData, idx) => (
          <div
            key={idx}
            className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-xl border border-gray-200"
          >
            <h3 className="font-bold text-lg mb-3">{roomData.roomType}</h3>

            <div className="space-y-2">
              {roomData.materials.map((item, matIdx) => (
                <div
                  key={matIdx}
                  className="text-sm border-b pb-2 last:border-b-0"
                >
                  <p className="font-semibold mb-1">{item.description}</p>

                  {item.length !== undefined ? (
                    <>
                      {item.note ? (
                        <p className="text-gray-600 italic">{item.note}</p>
                      ) : item.length > 0 ? (
                        <p className="text-gray-600">
                          Длина:{" "}
                          <span className="font-semibold">{item.length} м.п.</span>{" "}
                          ×{" "}
                          <span className="font-semibold">{item.lengthUnitPrice}$</span>{" "}
                          ={" "}
                          <span className="text-gray-950 font-bold">
                            {item.length * item.lengthUnitPrice}$
                          </span>
                        </p>
                      ) : null}
                      {item.holeCost > 0 && (
                        <p className="text-gray-600">
                          Отверстия:{" "}
                          <span className="font-semibold">{item.hole}</span> ×{" "}
                          <span className="font-semibold">
                            {item.holeCost / (item.hole || 1)}$
                          </span>{" "}
                          ={" "}
                          <span className="text-gray-950 font-bold">
                            {item.holeCost}$
                          </span>
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Площадь:{" "}
                        <span className="font-semibold">{item.area} м²</span> ×{" "}
                        <span className="font-semibold">{item.unitPrice}$</span>{" "}
                        ={" "}
                        <span className="text-gray-950 font-bold">
                          {item.areaCost}$
                        </span>
                      </p>

                      {item.slopeCoef > 1 && (
                        <p className="text-gray-600">
                          Коэффициент уклона:{" "}
                          <span className="font-semibold">×{item.slopeCoef}</span>
                        </p>
                      )}

                      {item.cornerCost > 0 && (
                        <p className="text-gray-600">
                          Углы:{" "}
                          <span className="font-semibold">
                            {item.corners} м.п.
                          </span>{" "}
                          ×{" "}
                          <span className="font-semibold">
                            {item.cornerUnitPrice}$
                          </span>{" "}
                          ={" "}
                          <span className="text-gray-950 font-bold">
                            {item.cornerCost}$
                          </span>
                        </p>
                      )}

                      {item.holeCost > 0 && (
                        <p className="text-gray-600">
                          Отверстия:{" "}
                          <span className="font-semibold">{item.hole}</span> ×{" "}
                          <span className="font-semibold">
                            {item.holeCost / (item.hole || 1)}$
                          </span>{" "}
                          ={" "}
                          <span className="text-gray-950 font-bold">
                            {item.holeCost}$
                          </span>
                        </p>
                      )}

                      {item.extras && item.extras.length > 0 && (
                        <div className="text-gray-600 mt-1">
                          {item.extras.map((e, i) => (
                            <p key={i}>
                              {e.label}:{" "}
                              <span className="font-semibold">{e.cost}$</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <p className="text-gray-700 font-bold">
                    Итого: <span className="text-gray-950">{item.cost}$</span>
                  </p>
                </div>
              ))}

              {roomData.products && roomData.products.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-semibold">Изделия</h4>
                  <div className="text-sm text-gray-700">
                    {roomData.products.map((p, pi) => (
                      <p key={pi}>
                        {p.description} —{" "}
                        <span className="font-semibold">{p.cost}$</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-3 sm:p-4 md:p-5 rounded-xl border-2 border-gray-200 mb-4 sm:mb-5 md:mb-6">
        <p className="text-2xl font-bold text-center">
          Общая стоимость:{" "}
          <span className="text-gray-950">{results.total}$</span>
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Начать сначала
      </button>
    </div>
  );
}
