import React from "react";
import { useState } from "react";

function Products(material, room, updateMaterial) {
  const [products, setProducts] = useState([]);
  const addProduct = (productType) => {
    const newProduct = {
      id: nextMaterialId,
      type: productType,
      count: 1,
    };

    setProducts((prev) => [...prev, newProduct]);
    setNextMaterialId((prev) => prev + 1);
  };

  return (
    <div className="mt-2 space-y-4">
      {material.surface === "sink" && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Размер раковины
          </label>
          <select
            value={material.sinkSize}
            onChange={(e) =>
              updateMaterial(room.id, material.id, "sinkSize", e.target.value)
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
          value={material.count || 1}
          onChange={(e) =>
            updateMaterial(
              room.id,
              material.id,
              "count",
              parseInt(e.target.value) || 1,
            )
          }
          min="1"
          className="input-base"
        />
      </div>
    </div>
  );
}

export default Products;
