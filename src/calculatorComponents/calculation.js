import {
  TILE_PRICES,
  TILE_ROOM_PRICES,
  TILE_ROOM_EPOXY_PRICES,
  GENERAL_PRICES,
  BATHROOM_PRICES,
  ROOM_PRICES,
  BALCONY_PRICES,
  EXTRA_ITEM_PRICES,
  ROOM_TYPES,
  PRODUCT_PRICES,
  ITEM_TYPES,
} from "../constants";

export function calculateTotal(rooms = []) {
  let total = 0;
  const allRooms = [];

  const getTileUnitPrice = (roomType, tileSize, groutType) => {
    if (roomType === "room") {
      return (
        (groutType === "epoxy"
          ? TILE_ROOM_EPOXY_PRICES[tileSize]
          : TILE_ROOM_PRICES[tileSize]) || 0
      );
    }
    return TILE_PRICES[tileSize] || 0;
  };

  rooms.forEach((room) => {
    const currentRoomData = {
      roomType: ROOM_TYPES[room.roomType]?.label || room.roomType,
      materials: [],
      products: [],
    };

    // 1. PROCESS MATERIALS
    room.materials.forEach((mat) => {
      // Extra surfaces (backsplash, countertop, windowsill, island) are length-based,
      // not tile-area-based — handle them separately.
      const EXTRA_SURFACES = [
        "backsplash",
        "countertop",
        "windowsill",
        "island",
      ];
      if (EXTRA_SURFACES.includes(mat.surface)) {
        const description = ITEM_TYPES[mat.surface]?.label || mat.surface;
        let length = 0;
        let lengthUnitPrice = 0;

        if (mat.surface === "backsplash") {
          length = Number(mat.backsplashLength) || 0;
          const timing = mat.isInstallAfterKitchen
            ? "afterKitchen"
            : "beforeKitchen";
          lengthUnitPrice = EXTRA_ITEM_PRICES.backsplash?.[timing] || 0;
        } else if (mat.surface === "countertop") {
          length = Number(mat.countertopLength) || 0;
          lengthUnitPrice =
            typeof EXTRA_ITEM_PRICES.countertop === "number"
              ? EXTRA_ITEM_PRICES.countertop
              : 0;
        } else if (mat.surface === "windowsill") {
          length = Number(mat.windowsillLength) || 0;
          lengthUnitPrice =
            typeof EXTRA_ITEM_PRICES.windowsill === "number"
              ? EXTRA_ITEM_PRICES.windowsill
              : 0;
        }
        // island: no numeric price, use the string note from constants
        const note =
          mat.surface === "island"
            ? String(EXTRA_ITEM_PRICES.island)
            : undefined;

        const holeCost = (Number(mat.hole) || 0) * (GENERAL_PRICES.hole || 0);
        const cost = length * lengthUnitPrice + holeCost;

        currentRoomData.materials.push({
          description,
          length,
          lengthUnitPrice,
          hole: mat.hole || 0,
          holeCost,
          cost,
          ...(note ? { note } : {}),
        });

        total += cost;
        return; // skip regular tile processing for this material
      }

      let cost = 0;
      const description = `${mat.tileSize || "Плитка"} (${mat.surface === "floor" ? "Пол" : "Стены"})`;

      const unitPrice = getTileUnitPrice(
        room.roomType,
        mat.tileSize,
        mat.groutType,
      );
      let areaCost = (Number(mat.area) || 0) * unitPrice;
      let slopeCoef;

      // Modifiers
      if (room.roomType === "room" && mat.isExtraTileType) {
        areaCost *= ROOM_PRICES.isExtraTileType || 1;
      }
      if (room.roomType === "balcony" && mat.slopeType) {
        const coef = BALCONY_PRICES.slopeType?.[mat.slopeType] || 1;
        areaCost *= coef;
        slopeCoef = coef;
      }

      const cornerUnit = GENERAL_PRICES.externalСorner || 0;
      const cornerCost = (Number(mat.externalCorners) || 0) * cornerUnit;
      const holeCost = (Number(mat.hole) || 0) * (GENERAL_PRICES.hole || 0);

      cost += areaCost + cornerCost + holeCost;

      const extras = [];

      // Bathroom logic
      if (room.roomType === "bath") {
        if (mat.showerTray && BATHROOM_PRICES.showerTray?.[mat.showerTrayType]) {
          const v = BATHROOM_PRICES.showerTray[mat.showerTrayType] * (mat.showerTrayCount || 1);
          extras.push({ label: `Душевой поддон`, cost: v });
          cost += v;
        }
        if (mat.bathroomInstall && BATHROOM_PRICES.bathroomInstall) {
          const v = BATHROOM_PRICES.bathroomInstall * (mat.bathroomCount || 1);
          extras.push({ label: `Монтаж ванны с экраном`, cost: v });
          cost += v;
        }
        if (mat.windowReveal) {
          const v = BATHROOM_PRICES.windowReveal * Number(mat.windowReveal);
          extras.push({ label: `Оконный откос`, cost: v });
          cost += v;
        }
        if (mat.shelfCount) {
          const v = BATHROOM_PRICES.shelf * Number(mat.shelfCount);
          extras.push({ label: `Полка`, cost: v });
          cost += v;
        }
      }

      // Balcony logic
      if (room.roomType === "balcony") {
        if (mat.baseboardLength) {
          const v = BALCONY_PRICES.baseboard * Number(mat.baseboardLength);
          extras.push({ label: `Плинтус`, cost: v });
          cost += v;
        }
        if (mat.externalBaseboardCornersCount > 0) {
          const v = BALCONY_PRICES.externalBaseboardCorners * Number(mat.externalBaseboardCornersCount);
          extras.push({ label: `Внешние углы плинтуса`, cost: v });
          cost += v;
        }
      }

      currentRoomData.materials.push({
        description,
        area: mat.area,
        unitPrice,
        areaCost,
        ...(slopeCoef !== undefined ? { slopeCoef } : {}),
        corners: mat.externalCorners || 0,
        cornerUnitPrice: cornerUnit,
        cornerCost,
        hole: mat.hole || 0,
        holeCost,
        extras,
        cost,
      });

      total += cost;
    });

    // 3. PROCESS PRODUCTS (Sinks, Buttons, etc.)
    if (room.products && Array.isArray(room.products)) {
      room.products.forEach((p) => {
        let pCost = 0;
        const typeKey = p.productType || p.type;
        const priceDef = PRODUCT_PRICES?.[typeKey];

        if (priceDef) {
          if (typeof priceDef === "object") {
            const sizeKey = p.sinkSize || p.size || "upTo120";
            pCost = priceDef[sizeKey] || 0;
          } else {
            pCost = priceDef * (p.count || 1);
          }
        }

        currentRoomData.products.push({
          description: `${typeKey} ${p.sinkSize ? `(${p.sinkSize})` : ""}`,
          count: p.count || 1,
          cost: pCost,
        });
        total += pCost;
      });
    }

    allRooms.push(currentRoomData);
  });

  return { total, allRooms };
}

export default calculateTotal;
