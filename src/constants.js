export const GENERAL_PRICES = {
  externalСorner: 50,
  hole: 10,
};

export const TILE_PRICES = {
  "1200x600, 60x60": 47,
  "1200x200, 1000x200": 60,
  "1500x750 и более": 55,
  "2800x1200 и более": 70,
  "1000x1000, 800x800": 55,
  "600x150": 85,
  "менее чем 600x150": 95,
};


export const TILE_ROOM_PRICES = {
  "1200x600, 60x60": 32,
  "1200x200, 1000x200": 40,
  "1500x750 и более": 40,
  "2800x1200 и более": 65,
  "1000x1000, 800x800": 40,
  "600x150": 60,
  "менее чем 600x150": 90,
};

export const TILE_ROOM_EPOXY_PRICES = {
  "1200x600, 60x60": 37,
  "1200x200, 1000x200": 50,
  "1500x750 и более": 45,
  "2800x1200 и более": 70,
  "1000x1000, 800x800": 45,
  "600x150": 75,
  "менее чем 600x150": 110,
};

export const CORNER_PRICES = {
  "external corner": 50,
};

export const BATHROOM_PRICES = {
  hole: GENERAL_PRICES.hole,
  externalСorner: GENERAL_PRICES.externalСorner,
  windowReveal: 85,
  shelf: 100,
  bathroomInstall: 350,
  showerTray: { flatFloor: 300, borderWithSlope: 400 },
};

export const ROOM_PRICES = {
  hole: GENERAL_PRICES.hole,
  externalСorner: GENERAL_PRICES.externalСorner,
  isExtraTileType: 1.2, // Coefficient for complex laying or relief tiles
};

export const BALCONY_PRICES = { 
  slopeType: {toTrap: 1.2, unified: 1}, // Coefficients for slope types
  baseboard: 50, // 
  externalBaseboardCorners: 10,
};

export const EXTRA_ITEM_PRICES = {
  countertop: 100,
  windowsill: 100,
  backsplash: { beforeKitchen: 50, afterKitchen: 80 },
  island: "Точная стоимость по запросу, от 1500$",
};

export const TILE_SIZES = Object.keys(TILE_PRICES);

export const ROOM_TYPES = {
  bath: { label: "Ванная, сан. узел", id: "bath" },
  room: { label: "Комната, кухня", id: "room" },
  balcony: { label: "Балкон", id: "balcony" },
};
export const ITEM_TYPES = {
  floor: { label: "Пол", id: "floor" },
  walls: { label: "Стены", id: "walls" },
  island: { label: "Остров", id: "island" },
  backsplash: { label: "Фартук", id: "backsplash" },
  countertop: { label: "Столешница", id: "countertop" },
  windowsill: { label: "Подоконник", id: "windowsill" },
};

export const PRODUCTS_TYPES = {
  sink: { label: "Раковина из керамогранита", id: "sink" },
  installationButton: {
    label: "Кнопка для инсталляции",
    id: "installationButton",
  },
  hiddenVentilation: { label: "Скрытая вентиляция", id: "hiddenVentilation" },
  socket: { label: "Розетка из керамогранита", id: "socket" },
  switch: { label: "Выключатель из керамогранита", id: "switch" },
  hiddenHook: { label: "Скрытый крючок-вешалка", id: "hiddenHook" },
};

// constants.js
export const PRODUCT_PRICES = {
  sink: { upTo120: 850, over120: 1000 },
  installationButton: 300,
  hiddenVentilation: 200,
  socket: 60,
  switch: 40,
  hiddenHook: 40,
};
