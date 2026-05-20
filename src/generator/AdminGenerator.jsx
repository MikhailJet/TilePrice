import React, { useState } from "react";


function AdminGenerator() {
  const [domain, setDomain] = useState(window.location.origin);
  const [secretKey, setSecretKey] = useState("");
  const [amount, setAmount] = useState(3);
  const [unit, setUnit] = useState("days"); // minutes, hours, days
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [expireDateText, setExpireDateText] = useState("");

  // Функция для создания HMAC-SHA256 подписи силами самого браузера
  const generateHmacSha256 = async (message, secret) => {
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    const secretData = encoder.encode(secret);

    const key = await window.crypto.subtle.importKey(
      "raw",
      secretData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await window.crypto.subtle.sign("HMAC", key, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!secretKey) {
      alert("Введите секретный ключ (CALC_SECRET_KEY) из настроек Netlify!");
      return;
    }

    // Считаем время жизни в миллисекундах
    let ms = 0;
    if (unit === "minutes") ms = amount * 60 * 1000;
    if (unit === "hours") ms = amount * 60 * 60 * 1000;
    if (unit === "days") ms = amount * 24 * 60 * 60 * 1000;

    const expiresAt = Date.now() + ms;
    const expiresDate = new Date(expiresAt);
    setExpireDateText(expiresDate.toLocaleString("ru-RU"));

    // 1. Собираем полезную нагрузку
    const payload = JSON.stringify({ expiresAt });
    
    // 2. Кодируем её в Base64 (безопасно для URL)
    const base64Payload = btoa(unescape(encodeURIComponent(payload)));

    // 3. Создаем криптографическую подпись
    const signature = await generateHmacSha256(payload, secretKey);

    // 4. Склеиваем токен через точку
    const token = `${base64Payload}.${signature}`;

    // 5. Формируем финальный URL
    // Убедимся, что домен не заканчивается на слэш
    const cleanDomain = domain.replace(/\/$/, "");
    setGeneratedUrl(`${cleanDomain}/?t=${token}`);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
        Генератор ссылок доступа
      </h2>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Домен сайта:</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="https://mysite.netlify.app"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Секретный ключ (CALC_SECRET_KEY):
          </label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Вставьте точь-в-точь как в Netlify"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Срок действия:</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Единица времени:</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="minutes">Минут</option>
              <option value="hours">Часов</option>
              <option value="days">Дней</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 font-bold rounded transition"
        >
          Сгенерировать ссылку
        </button>
      </form>

      {generatedUrl && (
        <div className="mt-6 p-4 bg-gray-800 rounded border border-indigo-900/50">
          <p className="text-xs text-green-400 font-medium mb-1">
            ✓ Ссылка активна до: {expireDateText}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={generatedUrl}
              className="flex-1 p-2 bg-gray-950 text-xs text-gray-300 rounded border border-gray-800"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 text-xs font-bold rounded transition ${
                copied ? "bg-green-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGenerator;