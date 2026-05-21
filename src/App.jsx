import { useEffect, useState } from "react";
import "./App.css";
import Rooms from "./calculatorComponents/rooms.jsx";
import Products from "./products.jsx";
import Results from "./calculatorComponents/Results.jsx";
import { calculateTotal } from "./calculatorComponents/calculation";
import AdminGenerator from "./generator/AdminGenerator";
import { ROOM_TYPES } from "./constants";
import { saveEstimate } from "./utils/sendToSheet";
import { buildDetailsText } from "./utils/formatEstimate";

export default function TileQuiz() {
  const [step, setStep] = useState("addMaterials");
  const [results, setResults] = useState(null);

  // === СОСТОЯНИЯ ДЛЯ ПРОВЕРКИ ДОСТУПА ===
  const [isCheckingAccess, setIsCheckingAccess] = useState(true); // Пока идет запрос к Netlify
  const [isAccessDenied, setIsAccessDenied] = useState(false); // Доступ заблокирован

  // === ОБНОВЛЕННЫЙ БЛОК: Строгая проверка токена при входе ===
   useEffect(() => {
    const checkAccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("t");

      // 1. Ищем токен (в приоритете из URL, если нет — из памяти)
      let token = tokenFromUrl;
      if (!token) {
        token = sessionStorage.getItem("calc_token");
      }

      // 2. Если токена вообще нет — сразу блокируем
      if (!token) {
        setIsAccessDenied(true);
        setIsCheckingAccess(false);
        return;
      }

      // 3. Если токен есть — отправляем на проверку бэкенду Netlify
      try {
        const response = await fetch("/.netlify/functions/validate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (result.valid) {
          // Токен живой! Сохраняем/обновляем в памяти
          sessionStorage.setItem("calc_token", token);
          setIsAccessDenied(false);

          // Стираем токен из адресной строки для красоты
          if (tokenFromUrl) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        } else {
          // Токен протух или подделан
          sessionStorage.removeItem("calc_token");
          setIsAccessDenied(true);
        }
      } catch (error) {
        console.error("Ошибка сети при проверке токена:", error);
        // При ошибке сети безопаснее заблокировать интерфейс
        setIsAccessDenied(true);
      } finally {
        // Проверка завершена, выключаем индикатор загрузки
        setIsCheckingAccess(false);
      }
    };

    // Запускаем проверку
    checkAccess();
  }, []); 

  const handleCalculate = (rooms) => {
    const { total, allRooms } = calculateTotal(rooms);
    const uuid = crypto.randomUUID();
    const computed = { total, allRooms, uuid };
    setResults(computed);
    setStep("results");
    saveEstimate({
      uuid,
      total,
      details: buildDetailsText(computed),
    });
  };

  const handleReset = () => {
    setStep("selectFirstRoom");
    setResults(null);
  };

const isGeneratorMode = window.location.search.includes("mode=generator");

  // Режим генератора отдаем сразу, ему токены не нужны (у него свой пароль внутри)
  if (isGeneratorMode) {
    return <AdminGenerator />;
  }

  // 1. Пока идет фоновая проверка в Netlify — показываем аккуратный спиннер/загрузку
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">
            Проверка безопасности...
          </p>
        </div>
      </div>
    );
  }

  // 2. Если бэкенд сказал, что токен невалидный — выдаем глухой экран блокировки
  if (isAccessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
          <div className="text-red-500 text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Доступ ограничен
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            У вас нет действующего ключа доступа, или срок действия вашей
            индивидуальной ссылки истек.
          </p>
          <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
            Пожалуйста, обратитесь к менеджеру, чтобы получить актуальную ссылку
            на калькулятор стоимости.
          </div>
        </div>
      </div>
    );
  } 

  // 3. Если токен валидный — рендерится обычный рабочий калькулятор
  return (
    <div className="min-h-screen flex items-center justify-center p-1 sm:p-4 font-sans">
      <div className="max-w-2xl w-full bg-white p-1 sm:p-6 md:p-8">
        {step !== "results" && (
          <Rooms step={step} setStep={setStep} onCalculate={handleCalculate} />
        )}

        {step === "results" && results && (
          <Results results={results} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
