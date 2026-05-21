const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

async function post(payload) {
  if (!APPS_SCRIPT_URL) {
    console.warn("[Sheet] VITE_APPS_SCRIPT_URL is not set");
    return;
  }
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
    console.log("[Sheet] sent:", payload.action, payload);
  } catch (err) {
    console.error("[Sheet] failed:", err);
  }
}

export function saveEstimate({ uuid, total, details }) {
  return post({ action: "save", uuid, total, details });
}

export function markEstimateSent({ uuid, channel }) {
  return post({
    action: "mark_sent",
    uuid,
    status: `Отправлено (${channel})`,
  });
}

export function markEstimateCopied({ uuid }) {
  return post({ action: "mark_sent", uuid, status: "Скопировано" });
}
