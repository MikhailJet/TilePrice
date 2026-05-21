const crypto = require('crypto');

// Netlify автоматически подтянет ключи из панели управления.
// CALC_SECRET_KEY  — подписывает обычные пользовательские токены.
// ADMIN_PASSWORD   — подписывает админ-токены (видны цены за каждую позицию).
const USER_SECRET = process.env.CALC_SECRET_KEY;
const ADMIN_SECRET = process.env.ADMIN_PASSWORD;

function signHmac(secret, payloadStr) {
  return crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');
}

exports.handler = async (event, context) => {
  // Разрешаем запросы только методом POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { token } = JSON.parse(event.body || '{}');

    if (!token) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false, error: 'Доступ запрещен: токен отсутствует' })
      };
    }

    // Разбиваем токен на полезную нагрузку и подпись
    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) {
      return { statusCode: 400, body: JSON.stringify({ valid: false, error: 'Неверный формат токена' }) };
    }

    // Декодируем payload из Base64 обратно в строку JSON
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');

    // Пытаемся проверить подпись обоими ключами.
    // Если совпадает с ADMIN_PASSWORD — токен админский.
    let isAdmin = false;
    let signatureValid = false;
    if (USER_SECRET && signature === signHmac(USER_SECRET, payloadStr)) {
      signatureValid = true;
    } else if (ADMIN_SECRET && signature === signHmac(ADMIN_SECRET, payloadStr)) {
      signatureValid = true;
      isAdmin = true;
    }

    if (!signatureValid) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false, error: 'Критическая ошибка безопасности' })
      };
    }

    // Проверяем время "смерти" ссылки
    const { expiresAt } = JSON.parse(payloadStr);
    if (Date.now() > expiresAt) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false, error: 'Срок действия ссылки истек' })
      };
    }

    // Если всё отлично, возвращаем valid: true и роль
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: true, isAdmin })
    };

  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: false, error: 'Не удалось обработать запрос' })
    };
  }
};