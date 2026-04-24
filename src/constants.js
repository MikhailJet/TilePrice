export const TILE_PRICES = {
  "1200x600, 60x60": 50,
  "1200x200, 1000x200": 55,
  "1500x750 и более": 65,
  "2800x1200 и более": 80,
  "1000x1000, 800x800": 45,
  "600x150": 52,
  "менее чем 600x150": 60,
};

export const CORNER_PRICES = {
  "external corner": 50,
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
  hiddenHook: { label: "Скрытый крючек-вешалка", id: "hiddenHook" },
};

// constants.js
export const PRODUCT_PRICES = {
  sink: { upTo120: 500, over120: 800 },
  installationButton: 150,
  hiddenVentilation: 200,
  socket: 100,
  switch: 100,
  hiddenHook: 50,
};