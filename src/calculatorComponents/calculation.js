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
  PRODUCTS_TYPES,
  ITEM_TYPES,
  GROUT_LABELS,
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
      roomType:
        ROOM_TYPES[room.roomType]?.label ||
        (room.roomType === "products_section" ? "Изделия" : room.roomType),
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
        let option;

        if (mat.surface === "backsplash") {
          length = Number(mat.backsplashLength) || 0;
          const timing = mat.isInstallAfterKitchen
            ? "afterKitchen"
            : "beforeKitchen";
          lengthUnitPrice = EXTRA_ITEM_PRICES.backsplash?.price?.[timing] || 0;
          option = EXTRA_ITEM_PRICES.backsplash?.labels?.[timing];
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
          ...(option ? { option } : {}),
          ...(note ? { note } : {}),
        });

        total += cost;
        return;
      }

      let cost = 0;
      const description = `${mat.tileSize || "Плитка"} (${mat.surface === "floor" ? "Пол" : "Стены"})`;

      const unitPrice = getTileUnitPrice(
        room.roomType,
        mat.tileSize,
        mat.groutType,
      );
      const areaCost = (Number(mat.area) || 0) * unitPrice;

      // Area-related modifiers, all tracked as { label, delta } so Results.jsx
      // renders them identically. Two shapes are supported:
      //   - applyCoef: multiplicative on areaCost (e.g. "Сложная укладка" ×1.2)
      //   - applyFlat: fixed price added to cost     (e.g. slope "Уклон к трапу" = 200$)
      // Both push a row even when delta = 0 so the chosen option stays visible.
      const modifiers = [];
      const applyCoef = (def, key) => {
        if (!def) return;
        const coef = key ? def.price?.[key] : def.price;
        if (coef == null) return;
        const label = key ? def.labels?.[key] : def.label;
        const delta =
          coef === 1 ? 0 : Math.round(areaCost * (coef - 1) * 100) / 100;
        modifiers.push({ label, delta });
      };
      const applyFlat = (def, key) => {
        if (!def) return;
        const price = key ? def.price?.[key] : def.price;
        if (price == null) return;
        const label = key ? def.labels?.[key] : def.label;
        modifiers.push({ label, delta: price });
      };

      if (room.roomType === "room" && mat.isExtraTileType) {
        applyCoef(ROOM_PRICES.isExtraTileType);
      }
      if (room.roomType === "balcony" && mat.slopeType) {
        applyFlat(BALCONY_PRICES.slopeType, mat.slopeType);
      }

      const modifierDelta = modifiers.reduce((sum, m) => sum + m.delta, 0);
      const cornerUnit = GENERAL_PRICES.externalСorner || 0;
      const cornerCost = (Number(mat.externalCorners) || 0) * cornerUnit;
      const holeCost = (Number(mat.hole) || 0) * (GENERAL_PRICES.hole || 0);

      cost += areaCost + modifierDelta + cornerCost + holeCost;

      const extras = [];

      // Bathroom logic
      if (room.roomType === "bath") {
        const trayPrice =
          BATHROOM_PRICES.showerTray?.price?.[mat.showerTrayType];
        if (mat.showerTray && trayPrice) {
          const qty = mat.showerTrayCount || 1;
          const delta = trayPrice * qty;
          extras.push({
            label: "Душевой поддон",
            type:
              BATHROOM_PRICES.showerTray?.labels?.[mat.showerTrayType] ||
              mat.showerTrayType,
            qty,
            qtyLabel: "шт.",
            unitPrice: trayPrice,
            delta,
            cost: delta,
          });
          cost += delta;
        }
        if (mat.bathroomInstall && BATHROOM_PRICES.bathroomInstall) {
          const unitP = BATHROOM_PRICES.bathroomInstall;
          const qty = mat.bathroomCount || 1;
          const delta = unitP * qty;
          extras.push({
            label: "Монтаж ванны с экраном",
            qty,
            qtyLabel: "шт.",
            unitPrice: unitP,
            delta,
            cost: delta,
          });
          cost += delta;
        }
        if (mat.windowReveal) {
          const unitP = BATHROOM_PRICES.windowReveal;
          const qty = Number(mat.windowReveal);
          const delta = unitP * qty;
          extras.push({
            label: "Откосы",
            qty,
            qtyLabel: "м.п.",
            unitPrice: unitP,
            delta,
            cost: delta,
          });
          cost += delta;
        }
        if (mat.shelfCount) {
          const unitP = BATHROOM_PRICES.shelf;
          const qty = Number(mat.shelfCount);
          const delta = unitP * qty;
          extras.push({
            label: "Полка из керамогранита",
            qty,
            qtyLabel: "шт.",
            unitPrice: unitP,
            delta,
            cost: delta,
          });
          cost += delta;
        }
      }

      // Balcony logic
      if (room.roomType === "balcony") {
        if (mat.baseboardLength) {
          const unitP = BALCONY_PRICES.baseboard;
          const qty = Number(mat.baseboardLength);
          const delta = unitP * qty;
          extras.push({
            label: "Плинтус",
            qty,
            qtyLabel: "м.п.",
            unitPrice: unitP,
            delta,
            cost: delta,
          });
          cost += delta;
        }
        if (mat.externalBaseboardCornersCount > 0) {
          const unitP = BALCONY_PRICES.externalBaseboardCorners;
          const qty = Number(mat.externalBaseboardCornersCount);
          const delta = unitP * qty;
          extras.push({
            label: "Внешние углы плинтуса",
            qty,
            qtyLabel: "шт.",
            unitPrice: unitP,
            delta,
            cost: delta,
          });
          cost += delta;
        }
      }

      const option =
        room.roomType === "room"
          ? GROUT_LABELS[mat.groutType] || GROUT_LABELS.cement
          : undefined;

      currentRoomData.materials.push({
        description,
        area: mat.area,
        unitPrice,
        areaCost,
        modifiers,
        corners: mat.externalCorners || 0,
        cornerUnitPrice: cornerUnit,
        cornerCost,
        hole: mat.hole || 0,
        holeCost,
        extras,
        cost,
        ...(option ? { option } : {}),
      });

      total += cost;
    });

    // 3. PROCESS PRODUCTS (Sinks, Buttons, etc.)
    if (room.products && Array.isArray(room.products)) {
      room.products.forEach((p) => {
        let pCost = 0;
        let unitP = 0;
        let detail = null;
        const typeKey = p.productType || p.type;
        const priceDef = PRODUCT_PRICES?.[typeKey];
        const productType = PRODUCTS_TYPES[typeKey];

        if (priceDef) {
          if (typeof priceDef === "object") {
            // Sized product (e.g. sink). Mirror the UI dropdown's "upTo120"
            // default so detail matches the price even when the user never
            // opened the dropdown. Option labels live on PRODUCTS_TYPES.
            const sizeKey = p.sinkSize || p.size || "upTo120";
            unitP = priceDef[sizeKey] || 0;
            pCost = unitP * (p.count || 1);
            detail = productType?.options?.[sizeKey] || sizeKey;
          } else {
            unitP = priceDef;
            pCost = priceDef * (p.count || 1);
          }
        }

        currentRoomData.products.push({
          description: productType?.label || typeKey,
          detail,
          count: p.count || 1,
          unitPrice: unitP,
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
