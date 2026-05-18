import React from "react";

function Row({ label, sublabel, value, delta }) {
  const hasDelta = parseFloat(delta) > 0;
  const hasValue = parseFloat(value) > 0;
  return (
    <div className="flex justify-between items-start gap-4 py-0.5">
      <div className="shrink-0">
        <span className="text-gray-500">{label}</span>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <div className="text-right shrink-0">
        {hasValue && (
          <span
            className={
              hasDelta
                ? "block text-sm text-gray-500"
                : "block font-bold text-gray-900"
            }
          >
            {value}
          </span>
        )}
        {hasDelta && (
          <span className="block font-bold text-gray-900">{delta}$</span>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
      {children}
    </p>
  );
}

export default function Results({ results, onReset }) {
  if (!results) return null;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">
        Итоговый расчет
      </h2>

      {results.allRooms.map((roomData, idx) => (
        <div
          key={idx}
          className="bg-gray-100 rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Room header */}
          <div className="  px-4 sm:px-5 py-3">
            <h3 className="font-bold text-lg">{roomData.roomType}</h3>
          </div>

          <div className="p-4 sm:p-5 space-y-3 ">
            {/* Materials */}
            {roomData.materials.map((item, matIdx) => (
              <div
                key={matIdx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Material title */}
                <div className="bg-white px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">
                    {item.description}
                  </p>
                  {item.option && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.option}
                    </p>
                  )}
                </div>

                <div className="px-4 py-3 text-base space-y-1.5">
                  {item.length !== undefined ? (
                    <>
                      {item.note ? (
                        <p className="text-gray-500 italic">{item.note}</p>
                      ) : item.length > 0 ? (
                        <Row
                          label="Длина"
                          value={`${item.length} м.п. × ${item.lengthUnitPrice}$ = ${item.length * item.lengthUnitPrice}$`}
                        />
                      ) : null}
                      {item.holeCost > 0 && (
                        <Row
                          label="Отверстия"
                          value={`${item.hole} шт. × ${item.holeCost / (item.hole || 1)}$ = ${item.holeCost}$`}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Row
                        label="Площадь"
                        value={`${item.area} м² × ${item.unitPrice}$ = ${item.areaCost}$`}
                      />
                      {item.modifiers &&
                        item.modifiers.map((m, mi) => (
                          <Row key={mi} label={m.label} delta={m.delta} />
                        ))}
                      {item.cornerCost > 0 && (
                        <Row
                          label="Внешние углы"
                          value={`${item.corners} м.п. × ${item.cornerUnitPrice}$ = ${item.cornerCost}$`}
                        />
                      )}
                      {item.holeCost > 0 && (
                        <Row
                          label="Отверстия"
                          value={`${item.hole} шт. × ${item.holeCost / (item.hole || 1)}$ = ${item.holeCost}$`}
                        />
                      )}
                    </>
                  )}

                  {/* Extras / add-ons */}
                  {item.extras && item.extras.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <SectionLabel>Дополнения</SectionLabel>
                      {item.extras.map((e, i) => (
                        <Row
                          key={i}
                          label={e.label}
                          sublabel={e.type}
                          value={`${e.qty} ${e.qtyLabel} × ${e.unitPrice}$`}
                          delta={e.delta}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Material total */}
                <div className="px-4 py-2.5  border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-950">
                    Итого
                  </span>
                  <span className="font-bold text-gray-900 text-base">
                    {item.cost}$
                  </span>
                </div>
              </div>
            ))}

            {/* Products */}
            {roomData.products && roomData.products.length > 0 && (
              <div className="pt-1">
                <SectionLabel>Изделия</SectionLabel>
                <div className="space-y-2">
                  {roomData.products.map((p, pi) => (
                    <div
                      key={pi}
                      className="rounded-xl border border-gray-200 px-4 py-3 flex justify-between items-start gap-4 bg-gray-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {p.description}
                        </p>
                        {p.detail && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {p.detail}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {p.unitPrice > 0 && (
                          <p className="text-sm text-gray-500">
                            {p.count} шт. × {p.unitPrice}$
                          </p>
                        )}
                        <p className="font-bold text-gray-900">{p.cost}$</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Grand total */}
      <div className="bg-gray-900 text-white rounded-2xl p-4 sm:p-5 text-center">
        <p className="text-sm text-gray-400 mb-1">Общая стоимость</p>
        <p className="text-3xl sm:text-4xl font-bold">{results.total}$</p>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition"
      >
        Начать сначала
      </button>
    </div>
  );
}
