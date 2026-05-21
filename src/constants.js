export const GENERAL_PRICES = {
  externalСorner: 50,
  hole: 10,
};

export const MIN_ORDER_AMOUNT = 500;

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

export const GROUT_LABELS = {
  epoxy: "Эпоксидная",
  cement: "Цементная",
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
  showerTray: {
    price: { flatFloor: 300, borderWithSlope: 400 },
    labels: {
      flatFloor: "Ровный пол с разуклонкой",
      borderWithSlope: "Бортик с разуклонкой (конверт)",
    },
  },
};

export const ROOM_PRICES = {
  hole: GENERAL_PRICES.hole,
  externalСorner: GENERAL_PRICES.externalСorner,
  isExtraTileType: { price: 1.2, label: "Сложная укладка" },
};

export const BALCONY_PRICES = {
  // slopeType is a flat per-material fee added to cost (not a coefficient).
  // "none" = no slope work; toTrap/unified add a fixed amount.
  slopeType: {
    price: { none: 0, unified: 150, toTrap: 200 },
    labels: {
      none: "Без уклона",
      unified: "Единый уклон (от квартиры)",
      toTrap: "Уклон к трапу",
    },
  },
  baseboard: 50,
  externalBaseboardCorners: 10,
};

export const EXTRA_ITEM_PRICES = {
  countertop: 100,
  windowsill: 100,
  backsplash: {
    price: { beforeKitchen: 50, afterKitchen: 80 },
    labels: {
      beforeKitchen: "Монтаж до установки кухни",
      afterKitchen: "Монтаж после установки кухни",
    },
  },
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
  sink: {
    label: "Раковина из керамогранита",
    id: "sink",
    media: {
      video: "/assets/Products/sink.mp4",
      photo: "/assets/Products/sink.jpg",
    },
    options: { upTo120: "до 120 см", over120: "более 120 см" },
  },
  installationButton: {
    label: "Кнопка для инсталляции",
    id: "installationButton",
    media: {
      video: "/assets/Products/installationButton.mp4",
      photo: "/assets/Products/installationButton.jpg",
    },
  },
  hiddenVentilation: {
    label: "Скрытая вентиляция",
    id: "hiddenVentilation",
    media: {
      video: "/assets/Products/hiddenVentilation.mp4",
      photo: "/assets/Products/hiddenVentilation.jpg",
    },
  },
  socket: {
    label: "Розетка из керамогранита",
    id: "socket",
    media: {
      video: "/assets/Products/socket.mp4",
      photo: "/assets/Products/socket.jpg",
    },
  },
  switch: {
    label: "Выключатель из керамогранита",
    id: "switch",
    media: {
      video: "/assets/Products/switch.mp4",
      photo: "/assets/Products/switch.jpg",
    },
  },
  hiddenHook: {
    label: "Скрытый крючок-вешалка",
    id: "hiddenHook",
    media: {
      video: "/assets/Products/hiddenHook.mp4",
      photo: "/assets/Products/hiddenHook.jpg",
    },
  },
  paperHolder: {
    label: "Держатель для туалетной бумаги",
    id: "paperHolder",
    media: {
      video: "/assets/Products/paperHolder.mp4",
      photo: "/assets/Products/paperHolder.jpg",
    },
  },
};

// constants.js
export const PRODUCT_PRICES = {
  sink: { upTo120: 850, over120: 1000 },
  installationButton: 300,
  hiddenVentilation: 200,
  socket: 60,
  switch: 40,
  hiddenHook: 40,
  paperHolder: 300,
};

export const CONTACTS = {
  telegramUsername: "Evgeniy_Batumi",
  whatsappPhone: "995551166688",
};
