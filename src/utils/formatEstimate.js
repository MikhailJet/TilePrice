import { formatMoney } from "./formatMoney";

function numberRooms(allRooms) {
  const counts = {};
  const totals = {};
  for (const r of allRooms) {
    totals[r.roomType] = (totals[r.roomType] || 0) + 1;
  }
  return allRooms.map((r) => {
    if (totals[r.roomType] > 1) {
      counts[r.roomType] = (counts[r.roomType] || 0) + 1;
      return { ...r, displayName: `${r.roomType} ${counts[r.roomType]}` };
    }
    return { ...r, displayName: r.roomType };
  });
}

export function roomSubtotal(room) {
  const matSum = room.materials.reduce((s, m) => s + (Number(m.cost) || 0), 0);
  const prodSum = (room.products || []).reduce(
    (s, p) => s + (Number(p.cost) || 0),
    0,
  );
  return matSum + prodSum;
}

function formatMaterialClient(m, lines) {
  const header = m.option ? `  ${m.description} — ${m.option}` : `  ${m.description}`;
  lines.push(header);

  if (m.length !== undefined) {
    if (m.note) {
      lines.push(`    ${m.note}`);
    } else if (m.length > 0) {
      lines.push(`    Длина: ${m.length} м.п.`);
    }
    if (m.hole > 0) lines.push(`    Отверстия: ${m.hole} шт.`);
  } else {
    if (m.area > 0) lines.push(`    Площадь: ${m.area} м²`);
    if (m.modifiers) {
      for (const mod of m.modifiers) {
        if (parseFloat(mod.delta) > 0) lines.push(`    ${mod.label}`);
      }
    }
    if (m.corners > 0) lines.push(`    Внешние углы: ${m.corners} м.п.`);
    if (m.hole > 0) lines.push(`    Отверстия: ${m.hole} шт.`);
  }

  if (m.extras && m.extras.length > 0) {
    for (const e of m.extras) {
      const type = e.type ? ` (${e.type})` : "";
      lines.push(`    + ${e.label}${type}: ${e.qty} ${e.qtyLabel}`);
    }
  }
}

function formatMaterialDetails(m, lines) {
  const header = m.option ? `  ${m.description} — ${m.option}` : `  ${m.description}`;
  lines.push(header);

  if (m.length !== undefined) {
    if (m.note) {
      lines.push(`    ${m.note}`);
    } else if (m.length > 0) {
      lines.push(
        `    Длина: ${m.length} м.п. × ${formatMoney(m.lengthUnitPrice)}$ = ${formatMoney(m.length * m.lengthUnitPrice)}$`,
      );
    }
    if (m.holeCost > 0) {
      const unit = formatMoney(m.holeCost / (m.hole || 1));
      lines.push(`    Отверстия: ${m.hole} шт. × ${unit}$ = ${formatMoney(m.holeCost)}$`);
    }
  } else {
    if (m.area > 0) {
      lines.push(`    Площадь: ${m.area} м² × ${formatMoney(m.unitPrice)}$ = ${formatMoney(m.areaCost)}$`);
    }
    if (m.modifiers) {
      for (const mod of m.modifiers) {
        if (parseFloat(mod.delta) > 0) {
          lines.push(`    ${mod.label}: +${formatMoney(mod.delta)}$`);
        }
      }
    }
    if (m.cornerCost > 0) {
      lines.push(
        `    Внешние углы: ${m.corners} м.п. × ${formatMoney(m.cornerUnitPrice)}$ = ${formatMoney(m.cornerCost)}$`,
      );
    }
    if (m.holeCost > 0) {
      const unit = formatMoney(m.holeCost / (m.hole || 1));
      lines.push(`    Отверстия: ${m.hole} шт. × ${unit}$ = ${formatMoney(m.holeCost)}$`);
    }
  }

  if (m.extras && m.extras.length > 0) {
    for (const e of m.extras) {
      const type = e.type ? ` (${e.type})` : "";
      lines.push(
        `    + ${e.label}${type}: ${e.qty} ${e.qtyLabel} × ${formatMoney(e.unitPrice)}$ = ${formatMoney(e.delta)}$`,
      );
    }
  }
}

function formatProducts(products, lines) {
  if (!products || products.length === 0) return;
  lines.push("  Изделия:");
  for (const p of products) {
    const detail = p.detail ? ` (${p.detail})` : "";
    if (p.unitPrice > 0) {
      lines.push(
        `    ${p.description}${detail} — ${p.count} шт. × ${formatMoney(p.unitPrice)}$ = ${formatMoney(p.cost)}$`,
      );
    } else {
      lines.push(`    ${p.description}${detail} — ${p.count} шт.`);
    }
  }
}

export function buildClientMessage(results) {
  const lines = ["Смета:", ""];
  const rooms = numberRooms(results.allRooms);

  for (const room of rooms) {
    lines.push(`📍 ${room.displayName}`);
    for (const m of room.materials) formatMaterialClient(m, lines);
    if (room.products && room.products.length > 0) {
      lines.push("");
      formatProducts(room.products, lines);
    }
    lines.push("");
  }

  lines.push(`💰 ИТОГО: ${formatMoney(results.total)}$`);
  return lines.join("\n");
}

export function buildDetailsText(results) {
  const lines = ["Смета:", ""];
  const rooms = numberRooms(results.allRooms);

  for (const room of rooms) {
    lines.push(`📍 ${room.displayName}`);
    for (const m of room.materials) formatMaterialDetails(m, lines);
    if (room.products && room.products.length > 0) {
      lines.push("");
      formatProducts(room.products, lines);
    }
    lines.push("");
    lines.push(`  Итого ${room.displayName}: ${formatMoney(roomSubtotal(room))}$`);
    lines.push("");
  }

  lines.push(`💰 ИТОГО: ${formatMoney(results.total)}$`);
  return lines.join("\n");
}
